from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Wallet, Transaction, TransactionType
from routers.auth import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SendMoneyRequest(BaseModel):
    receiver_phone: str
    amount: float
    note: Optional[str] = ""

@router.post("/send")
def send_money(data: SendMoneyRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    receiver = db.query(User).filter(User.phone == data.receiver_phone).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    if receiver.id == user.id:
        raise HTTPException(status_code=400, detail="Cannot send to yourself")
    sender_wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
    if sender_wallet.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    receiver_wallet = db.query(Wallet).filter(Wallet.user_id == receiver.id).first()
    sender_wallet.balance -= data.amount
    receiver_wallet.balance += data.amount
    txn_debit = Transaction(sender_id=user.id, receiver_id=receiver.id,
                            amount=data.amount, type=TransactionType.debit, note=data.note)
    db.add(txn_debit)
    db.commit()
    return {"message": f"₹{data.amount} sent to {receiver.name}", "new_balance": sender_wallet.balance}

@router.get("/history")
def get_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sent = db.query(Transaction).filter(Transaction.sender_id == user.id).all()
    received = db.query(Transaction).filter(
        Transaction.receiver_id == user.id, Transaction.sender_id != user.id).all()
    def fmt(t, direction):
        return {"id": t.id, "amount": t.amount, "note": t.note,
                "direction": direction, "created_at": str(t.created_at)}
    history = [fmt(t, "debit") for t in sent] + [fmt(t, "credit") for t in received]
    history.sort(key=lambda x: x["created_at"], reverse=True)
    return history