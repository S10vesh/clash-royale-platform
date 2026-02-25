from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime, timedelta, timezone
from typing import Optional, List
import pytz

from database import engine, Base, get_db
from models import User, Tournament, Clan, ClanMember, TournamentParticipant
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
    country_code: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    clash_tag: Optional[str] = None
    country_code: Optional[str] = None
    
    @validator('clash_tag')
    def clash_tag_valid(cls, v):
        if v:
            if not v.startswith('#'):
                raise ValueError("Clash Tag должен начинаться с #")
            if len(v) < 4 or len(v) > 10:
                raise ValueError("Clash Tag должен быть от 4 до 10 символов")
            return v.upper()
        return v


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
    participants_count: int = 0
    is_joined: bool = False
    
    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc).isoformat().replace('+00:00', 'Z')
        }


class TournamentParticipantResponse(BaseModel):
    id: int
    user_id: int
    username: str
    clash_tag: Optional[str]
    country_code: Optional[str] = None
    country_flag: Optional[str] = None
    joined_at: datetime
    
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
    is_member: bool = False
    
    class Config:
        orm_mode = True


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    trophies: int
    clan_tag: Optional[str]


# ==================== 🔧 Helper функции (UTC) ====================

def ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def model_to_dict(model):
    """Конвертирует SQLAlchemy модель в словарь"""
    return {c.name: getattr(model, c.name) for c in model.__table__.columns}

# Карта флагов
FLAG_MAP = {
    'RU': '🇷🇺', 'US': '🇺🇸', 'DE': '🇩🇪', 'FR': '🇫🇷',
    'GB': '🇬🇧', 'CN': '🇨🇳', 'BR': '🇧🇷', 'UA': '🇺🇦',
    'KZ': '🇰🇿', 'BY': '🇧🇾'
}


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
            detail="Неверное имя пользователя и/или пароль",
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


@app.patch("/api/users/me", response_model=UserResponse)
def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = {}
    
    if profile_data.clash_tag is not None:
        update_data['clash_tag'] = profile_data.clash_tag
    
    if profile_data.country_code is not None:
        update_data['country_code'] = profile_data.country_code
    
    if update_data:
        for key, value in update_data.items():
            setattr(current_user, key, value)
        db.commit()
        db.refresh(current_user)
    
    return current_user


# ==================== 🏆 Tournament эндпоинты ====================

@app.get("/api/tournaments", response_model=List[TournamentResponse])
def get_tournaments(
    status_filter: Optional[str] = None, 
    mode_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now_utc = datetime.now(timezone.utc)
    tournaments = db.query(Tournament).all()
    
    result = []
    for t in tournaments:
        tournament_date_utc = ensure_utc(t.date)
        time_until_start = tournament_date_utc - now_utc
        
        if tournament_date_utc + timedelta(hours=2) <= now_utc:
            status = "past"
        elif time_until_start <= timedelta(hours=24):
            status = "active"
        else:
            status = "future"
        
        participants_count = db.query(TournamentParticipant).filter(
            TournamentParticipant.tournament_id == t.id
        ).count()
        
        is_joined = db.query(TournamentParticipant).filter(
            TournamentParticipant.tournament_id == t.id,
            TournamentParticipant.user_id == current_user.id
        ).first() is not None
        
        result.append({
            "id": t.id,
            "name": t.name,
            "date": t.date,
            "prize": t.prize,
            "mode": t.mode,
            "max_players": t.max_players,
            "status": status,
            "created_by": t.created_by,
            "participants_count": participants_count,
            "is_joined": is_joined
        })
    
    if status_filter:
        result = [t for t in result if t["status"] == status_filter]
    
    if mode_filter:
        result = [t for t in result if t["mode"] == mode_filter]
    
    return result


@app.get("/api/tournaments/{tournament_id}", response_model=TournamentResponse)
def get_tournament(
    tournament_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    
    now_utc = datetime.now(timezone.utc)
    tournament_date_utc = ensure_utc(tournament.date)
    time_until_start = tournament_date_utc - now_utc
    
    if tournament_date_utc + timedelta(hours=2) <= now_utc:
        status = "past"
    elif time_until_start <= timedelta(hours=24):
        status = "active"
    else:
        status = "future"
    
    participants_count = db.query(TournamentParticipant).filter(
        TournamentParticipant.tournament_id == tournament_id
    ).count()
    
    is_joined = db.query(TournamentParticipant).filter(
        TournamentParticipant.tournament_id == tournament_id,
        TournamentParticipant.user_id == current_user.id
    ).first() is not None
    
    return {
        "id": tournament.id,
        "name": tournament.name,
        "date": tournament.date,
        "prize": tournament.prize,
        "mode": tournament.mode,
        "max_players": tournament.max_players,
        "status": status,
        "created_by": tournament.created_by,
        "participants_count": participants_count,
        "is_joined": is_joined
    }


@app.post("/api/tournaments", response_model=TournamentResponse, status_code=status.HTTP_201_CREATED)
def create_tournament(
    tournament: TournamentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tournament_date_utc = ensure_utc(tournament.date)
    now_utc = datetime.now(timezone.utc)
    
    if tournament_date_utc <= now_utc:
        raise HTTPException(status_code=400, detail="Нельзя создать турнир с датой в прошлом")
    
    new_tournament = Tournament(
        name=tournament.name,
        date=tournament_date_utc,
        prize=tournament.prize,
        mode=tournament.mode,
        max_players=tournament.max_players,
        created_by=current_user.id,
        status="future"
    )
    db.add(new_tournament)
    db.commit()
    db.refresh(new_tournament)
    return new_tournament


# ==================== 🎮 Tournament Participation ====================

@app.post("/api/tournaments/{tournament_id}/join", status_code=status.HTTP_200_OK)
def join_tournament(
    tournament_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    
    now_utc = datetime.now(timezone.utc)
    tournament_date_utc = ensure_utc(tournament.date)
    
    if tournament_date_utc <= now_utc:
        raise HTTPException(status_code=400, detail="Нельзя вступить в начавшийся турнир")
    
    existing = db.query(TournamentParticipant).filter(
        TournamentParticipant.user_id == current_user.id,
        TournamentParticipant.tournament_id == tournament_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Вы уже участвуете в этом турнире")
    
    participants_count = db.query(TournamentParticipant).filter(
        TournamentParticipant.tournament_id == tournament_id
    ).count()
    if participants_count >= tournament.max_players:
        raise HTTPException(status_code=400, detail="В турнире нет свободных мест")
    
    participant = TournamentParticipant(
        user_id=current_user.id,
        tournament_id=tournament_id
    )
    db.add(participant)
    db.commit()
    
    return {"message": "Вы успешно присоединились к турниру"}


@app.post("/api/tournaments/{tournament_id}/leave", status_code=status.HTTP_200_OK)
def leave_tournament(
    tournament_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    
    participant = db.query(TournamentParticipant).filter(
        TournamentParticipant.user_id == current_user.id,
        TournamentParticipant.tournament_id == tournament_id
    ).first()
    if not participant:
        raise HTTPException(status_code=400, detail="Вы не участвуете в этом турнире")
    
    db.delete(participant)
    db.commit()
    
    return {"message": "Вы вышли из турнира"}


@app.get("/api/tournaments/{tournament_id}/participants", response_model=List[TournamentParticipantResponse])
def get_tournament_participants(
    tournament_id: int,
    db: Session = Depends(get_db)
):
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    
    participants = db.query(TournamentParticipant).filter(
        TournamentParticipant.tournament_id == tournament_id
    ).all()
    
    result = []
    for p in participants:
        user = db.query(User).filter(User.id == p.user_id).first()
        if user:
            flag = FLAG_MAP.get(user.country_code, '🌍') if user.country_code else '🌍'
            result.append({
                "id": p.id,
                "user_id": p.user_id,
                "username": user.username,
                "clash_tag": user.clash_tag,
                "country_code": user.country_code,
                "country_flag": flag,
                "joined_at": p.joined_at
            })
    
    return result


# ==================== 👥 Clan эндпоинты ====================

@app.get("/api/clans", response_model=List[ClanResponse])
def get_clans(
    search: Optional[str] = None, 
    tag: Optional[str] = None, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Clan)
    if search:
        query = query.filter(Clan.name.ilike(f"%{search}%"))
    if tag:
        query = query.filter(Clan.tag == tag.upper())
    
    clans = query.all()
    
    # 🔧 Проверяем состоит ли пользователь в каждом клане
    result = []
    for clan in clans:
        is_member = db.query(ClanMember).filter(
            ClanMember.user_id == current_user.id,
            ClanMember.clan_id == clan.id
        ).first() is not None
        
        clan_dict = model_to_dict(clan)
        clan_dict['is_member'] = is_member
        result.append(clan_dict)
    
    return result


@app.get("/api/clans/{clan_id}", response_model=ClanResponse)
def get_clan(
    clan_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clan = db.query(Clan).filter(Clan.id == clan_id).first()
    if not clan:
        raise HTTPException(status_code=404, detail="Клан не найден")
    
    is_member = db.query(ClanMember).filter(
        ClanMember.user_id == current_user.id,
        ClanMember.clan_id == clan_id
    ).first() is not None
    
    clan_dict = model_to_dict(clan)
    clan_dict['is_member'] = is_member
    
    return clan_dict


@app.post("/api/clans", response_model=ClanResponse, status_code=status.HTTP_201_CREATED)
def create_clan(
    clan: ClanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔧 Проверяем состоит ли пользователь уже в клане
    existing_membership = db.query(ClanMember).filter(
        ClanMember.user_id == current_user.id
    ).first()
    
    if existing_membership:
        current_clan = db.query(Clan).filter(Clan.id == existing_membership.clan_id).first()
        raise HTTPException(
            status_code=400,
            detail=f"Вы уже состоите в клане '{current_clan.name}' ({current_clan.tag}). Сначала покиньте его."
        )
    
    if db.query(Clan).filter(Clan.tag == clan.tag.upper()).first():
        raise HTTPException(status_code=400, detail="Клан с таким тегом уже существует")
    
    new_clan = Clan(**model_to_dict(clan))
    db.add(new_clan)
    db.commit()
    db.refresh(new_clan)
    
    member = ClanMember(user_id=current_user.id, clan_id=new_clan.id)
    db.add(member)
    db.commit()
    
    clan_dict = model_to_dict(new_clan)
    clan_dict['is_member'] = True
    
    return clan_dict


@app.post("/api/clans/{clan_id}/join", status_code=status.HTTP_200_OK)
def join_clan(
    clan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clan = db.query(Clan).filter(Clan.id == clan_id).first()
    if not clan:
        raise HTTPException(status_code=404, detail="Клан не найден")
    
    # 🔧 ПРОВЕРКА: состоит ли пользователь уже в каком-то клане
    existing_membership = db.query(ClanMember).filter(
        ClanMember.user_id == current_user.id
    ).first()
    
    if existing_membership:
        current_clan = db.query(Clan).filter(Clan.id == existing_membership.clan_id).first()
        raise HTTPException(
            status_code=400, 
            detail=f"Вы уже состоите в клане '{current_clan.name}' ({current_clan.tag}). Сначала покиньте его."
        )
    
    member = ClanMember(user_id=current_user.id, clan_id=clan_id)
    db.add(member)
    clan.members_count += 1
    db.commit()
    
    return {"message": "Вы успешно присоединились к клану"}


@app.post("/api/clans/leave", status_code=status.HTTP_200_OK)
def leave_clan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = db.query(ClanMember).filter(
        ClanMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=400, detail="Вы не состоите в клане")
    
    clan = db.query(Clan).filter(Clan.id == member.clan_id).first()
    if clan:
        clan.members_count = max(0, clan.members_count - 1)
    
    db.delete(member)
    db.commit()
    
    return {"message": "Вы успешно покинули клан"}


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