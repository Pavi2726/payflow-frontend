from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime, enum

class TransactionType(str, enum.Enum):
    credit = "credit"
    debit = "debit"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    phone = Column(String, unique=True)
    wallet = relationship("Wallet", back_populates="owner", uselist=False)
    sent = relationship("Transaction", foreign_keys="Transaction.sender_id")
    received = relationship("Transaction", foreign_keys="Transaction.receiver_id")

class Wallet(Base):
    __tablename__ = "wallets"
    id = Column(Integer, primary_key=True)
    balance = Column(Float, default=0.0)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    owner = relationship("User", back_populates="wallet")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    note = Column(String, nullable=True)
    type = Column(Enum(TransactionType))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)