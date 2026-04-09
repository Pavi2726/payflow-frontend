from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, wallet, transactions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PayFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(wallet.router, prefix="/api/wallet", tags=["Wallet"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])

@app.get("/")
def root():
    return {"message": "PayFlow API running"}