from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="client")
    clash_tag = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    tournaments_created = relationship("Tournament", back_populates="creator")
    clans_joined = relationship("ClanMember", back_populates="user")


class Tournament(Base):
    __tablename__ = "tournaments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    prize = Column(Integer, nullable=False)
    mode = Column(String, nullable=False)
    max_players = Column(Integer, nullable=False)
    status = Column(String, default="future")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    creator = relationship("User", back_populates="tournaments_created")


class Clan(Base):
    __tablename__ = "clans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    tag = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    members_count = Column(Integer, default=1)
    trophies = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    members = relationship("ClanMember", back_populates="clan")


class ClanMember(Base):
    __tablename__ = "clan_members"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clan_id = Column(Integer, ForeignKey("clans.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="clans_joined")
    clan = relationship("Clan", back_populates="members")