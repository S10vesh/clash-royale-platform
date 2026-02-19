from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime, timedelta
from typing import Optional, List

from database import engine, Base, get_db
from models import User, Tournament, Clan, ClanMember
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, validate_email, validate_password, validate_username,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# 🗄️ Создание таблиц
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clash Royale Platform API")

# 🌐 CORS настройка
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== 🔷 Pydantic схемы ====================

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str
    
    @validator('username')
    def username_valid(cls, v):
        is_valid, msg = validate_username(v)
        if not is_valid:
            raise ValueError(msg)
        return v
    
    @validator('email')
    def email_valid(cls, v):
        if not validate_email(v):
            raise ValueError("Некорректный формат email")
        return v
    
    @validator('password')
    def password_valid(cls, v):
        is_valid, msg = validate_password(v)
        if not is_valid:
            raise ValueError(msg)
        return v
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError("Пароли не совпадают")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    clash_tag: Optional[str]
    created_at: datetime
    
    class Config:
        orm_mode = True  # ← Важно для Pydantic v1!


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
    
    class Config:
        orm_mode = True


class TournamentCreate(BaseModel):
    name: str = Field(..., min_length=3)
    date: datetime
    prize: int = Field(..., ge=0)
    mode: str
    max_players: int = Field(..., ge=2)
    
    @validator('mode')
    def mode_valid(cls, v):
        if v not in ["1v1", "2v2"]:
            raise ValueError("Режим должен быть '1v1' или '2v2'")
        return v


class TournamentResponse(BaseModel):
    id: int
    name: str
    date: datetime
    prize: int
    mode: str
    max_players: int
    status: str
    created_by: int
    
    class Config:
        orm_mode = True


class ClanCreate(BaseModel):
    name: str = Field(..., min_length=3)
    tag: str = Field(..., regex=r'^#[A-Z0-9]{3,10}$')
    description: Optional[str] = None
    
    @validator('tag')
    def tag_upper(cls, v):
        return v.upper()


class ClanResponse(BaseModel):
    id: int
    name: str
    tag: str
    description: Optional[str]
    members_count: int
    trophies: int
    
    class Config:
        orm_mode = True


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    trophies: int
    clan_tag: Optional[str]


# ==================== 🔐 Auth эндпоинты ====================

@app.post("/api/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")
    
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    
    hashed_pw = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pw
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(
        data={"sub": new_user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }


@app.post("/api/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@app.get("/api/users/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ==================== 🏆 Tournament эндпоинты ====================

@app.get("/api/tournaments", response_model=List[TournamentResponse])
def get_tournaments(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Tournament)
    if status_filter in ["future", "active", "past"]:
        query = query.filter(Tournament.status == status_filter)
    return query.all()


@app.get("/api/tournaments/{tournament_id}", response_model=TournamentResponse)
def get_tournament(tournament_id: int, db: Session = Depends(get_db)):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    return tournament


@app.post("/api/tournaments", response_model=TournamentResponse, status_code=status.HTTP_201_CREATED)
def create_tournament(
    tournament: TournamentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_tournament = Tournament(
        **tournament.dict(),
        created_by=current_user.id,
        status="future"
    )
    db.add(new_tournament)
    db.commit()
    db.refresh(new_tournament)
    return new_tournament


# ==================== 👥 Clan эндпоинты ====================

@app.get("/api/clans", response_model=List[ClanResponse])
def get_clans(search: Optional[str] = None, tag: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Clan)
    if search:
        query = query.filter(Clan.name.ilike(f"%{search}%"))
    if tag:
        query = query.filter(Clan.tag == tag.upper())
    return query.all()


@app.get("/api/clans/{clan_id}", response_model=ClanResponse)
def get_clan(clan_id: int, db: Session = Depends(get_db)):
    clan = db.query(Clan).filter(Clan.id == clan_id).first()
    if not clan:
        raise HTTPException(status_code=404, detail="Клан не найден")
    return clan


@app.post("/api/clans", response_model=ClanResponse, status_code=status.HTTP_201_CREATED)
def create_clan(
    clan: ClanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if db.query(Clan).filter(Clan.tag == clan.tag.upper()).first():
        raise HTTPException(status_code=400, detail="Клан с таким тегом уже существует")
    
    new_clan = Clan(**clan.dict())
    db.add(new_clan)
    db.commit()
    db.refresh(new_clan)
    
    member = ClanMember(user_id=current_user.id, clan_id=new_clan.id)
    db.add(member)
    db.commit()
    
    return new_clan


@app.post("/api/clans/{clan_id}/join", status_code=status.HTTP_200_OK)
def join_clan(
    clan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clan = db.query(Clan).filter(Clan.id == clan_id).first()
    if not clan:
        raise HTTPException(status_code=404, detail="Клан не найден")
    
    existing = db.query(ClanMember).filter(
        ClanMember.user_id == current_user.id,
        ClanMember.clan_id == clan_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Вы уже в этом клане")
    
    member = ClanMember(user_id=current_user.id, clan_id=clan_id)
    db.add(member)
    clan.members_count += 1
    db.commit()
    
    return {"message": "Вы успешно присоединились к клану"}


# ==================== 📊 Leaderboard эндпоинт ====================

@app.get("/api/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id.desc()).limit(limit).all()
    
    leaderboard = []
    for rank, user in enumerate(users, start=1):
        clan_member = db.query(ClanMember).filter(ClanMember.user_id == user.id).first()
        clan_tag = None
        if clan_member:
            clan = db.query(Clan).filter(Clan.id == clan_member.clan_id).first()
            if clan:
                clan_tag = clan.tag
        
        trophies = user.id * 10
        
        leaderboard.append(LeaderboardEntry(
            rank=rank,
            username=user.username,
            trophies=trophies,
            clan_tag=clan_tag
        ))
    
    return leaderboard


# ==================== 🏠 Health check ====================

@app.get("/")
def root():
    return {"message": "Clash Royale Platform API работает! 🎮"}


@app.get("/api/health")
def health():
    return {"status": "ok"}