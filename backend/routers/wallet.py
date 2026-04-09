from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Wallet, Transaction, TransactionType
from routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class AddMoneyRequest(BaseModel):
    amount: float

@router.get("/balance")
def get_balance(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
    return {"balance": wallet.balance, "name": user.name}

@router.post("/add-money")
def add_money(data: AddMoneyRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
    wallet.balance += data.amount
    txn = Transaction(sender_id=user.id, receiver_id=user.id,
                      amount=data.amount, type=TransactionType.credit, note="Wallet top-up")
    db.add(txn)
    db.commit()
    return {"message": f"₹{data.amount} added", "new_balance": wallet.balance}