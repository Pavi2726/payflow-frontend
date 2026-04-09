import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [balance, setBalance] = useState(null)
  const [addAmt, setAddAmt] = useState('')
  const [loading, setLoading] = useState(false)
  const [txns, setTxns] = useState([])

  const load = () => {
    api.get('/wallet/balance').then(r=>setBalance(r.data.balance))
    api.get('/transactions/history').then(r=>setTxns(r.data.slice(0,4)))
  }
  useEffect(()=>{ load() },[])

  const addMoney = async () => {
    if (!addAmt||isNaN(addAmt)||parseFloat(addAmt)<=0) return toast.error('Enter valid amount')
    setLoading(true)
    try {
      const {data} = await api.post('/wallet/add-money',{amount:parseFloat(addAmt)})
      setBalance(data.new_balance); setAddAmt('')
      toast.success(`₹${parseFloat(addAmt)} added!`)
      load()
    } catch(e){ toast.error(e.response?.data?.detail||'Error') }
    finally{ setLoading(false) }
  }

  const fmt = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(160deg,#1a0533 0%,var(--bg2) 100%)',padding:'1.5rem 1.25rem 3.5rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-60px',right:'-60px',width:'220px',height:'220px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-40px',left:'20%',width:'160px',height:'160px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.1),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',maxWidth:480,margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16}}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{color:'var(--text-3)',fontSize:11,fontWeight:600,letterSpacing:'0.5px'}}>GOOD DAY</p>
              <p style={{fontWeight:600,fontSize:15}}>{user?.name?.split(' ')[0]}</p>
            </div>
          </div>
          <button onClick={logout} style={{background:'rgba(255,255,255,0.06)',border:'1px solid var(--border)',borderRadius:10,padding:'8px 14px',color:'var(--text-2)',fontSize:12,fontWeight:600,cursor:'pointer'}}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{maxWidth:480,margin:'-2.5rem auto 0',padding:'0 1rem 2rem',position:'relative'}}>
        {/* Balance Card */}
        <div style={{background:'rgba(13,13,24,0.98)',border:'1px solid rgba(124,58,237,0.2)',borderRadius:22,padding:'1.75rem',marginBottom:'1rem',backdropFilter:'blur(20px)'}}>
          <p style={{color:'var(--text-3)',fontSize:11,fontWeight:600,letterSpacing:'1px',marginBottom:6}}>WALLET BALANCE</p>
          <h1 style={{fontSize:'2.6rem',fontWeight:700,letterSpacing:'-1.5px',marginBottom:4}}>
            ₹ {balance!==null ? Number(balance).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}) : '—'}
          </h1>
          <p style={{color:'var(--text-3)',fontSize:12}}>📱 {user?.phone}</p>

          {/* Add money */}
          <div style={{marginTop:'1.5rem',paddingTop:'1.25rem',borderTop:'1px solid var(--border)'}}>
            <p style={{color:'var(--text-3)',fontSize:11,fontWeight:600,letterSpacing:'0.8px',marginBottom:10}}>ADD MONEY</p>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              <input value={addAmt} onChange={e=>setAddAmt(e.target.value)} placeholder="₹ Enter amount" type="number"
                style={{flex:1,padding:'11px 14px',borderRadius:10,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text)',fontSize:15,fontWeight:600,outline:'none',fontFamily:'DM Sans,sans-serif'}}
                onFocus={e=>{e.target.style.borderColor='rgba(124,58,237,0.5)';e.target.style.background='rgba(124,58,237,0.06)'}}
                onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.background='var(--surface)'}}
              />
              <button onClick={addMoney} disabled={loading}
                style={{padding:'11px 20px',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',border:'none',borderRadius:10,color:'#fff',fontWeight:600,fontSize:14,cursor:'pointer',whiteSpace:'nowrap'}}>
                {loading?'...':'Add'}
              </button>
            </div>
            <div style={{display:'flex',gap:6}}>
              {[100,500,1000,2000].map(a=>(
                <button key={a} onClick={()=>setAddAmt(String(a))}
                  style={{flex:1,padding:'7px 0',background:'rgba(124,58,237,0.08)',border:'1px solid rgba(124,58,237,0.15)',borderRadius:8,color:'#a78bfa',fontWeight:600,fontSize:12,cursor:'pointer'}}>
                  ₹{a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1rem'}}>
          {[
            {to:'/send',icon:'💸',label:'Send Money',sub:'Transfer instantly'},
            {to:'/history',icon:'📋',label:'History',sub:'All transactions'},
          ].map(a=>(
            <Link key={a.to} to={a.to}
              style={{background:'rgba(13,13,24,0.98)',border:'1px solid var(--border)',borderRadius:18,padding:'1.25rem',textDecoration:'none',display:'flex',flexDirection:'column',gap:10,transition:'border-color 0.2s,background 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(124,58,237,0.3)';e.currentTarget.style.background='rgba(124,58,237,0.04)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='rgba(13,13,24,0.98)'}}>
              <div style={{width:42,height:42,borderRadius:12,background:'rgba(124,58,237,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem'}}>{a.icon}</div>
              <div>
                <p style={{color:'var(--text)',fontWeight:600,fontSize:14}}>{a.label}</p>
                <p style={{color:'var(--text-3)',fontSize:12,marginTop:2}}>{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Transactions */}
        {txns.length>0 && (
          <div style={{background:'rgba(13,13,24,0.98)',border:'1px solid var(--border)',borderRadius:20,padding:'1.25rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <p style={{fontWeight:600,fontSize:14}}>Recent activity</p>
              <Link to="/history" style={{color:'#a78bfa',fontSize:12,fontWeight:600,textDecoration:'none'}}>See all →</Link>
            </div>
            {txns.map((t,i)=>(
              <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 0',borderTop:i===0?'none':'1px solid var(--border)'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:38,height:38,borderRadius:11,background:t.direction==='credit'?'var(--green-dim)':'var(--red-dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.95rem'}}>
                    {t.direction==='credit'?'⬇':'⬆'}
                  </div>
                  <div>
                    <p style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>{t.note||(t.direction==='credit'?'Received':'Sent')}</p>
                    <p style={{fontSize:11,color:'var(--text-3)',marginTop:2}}>{fmt(t.created_at)}</p>
                  </div>
                </div>
                <p style={{fontWeight:600,fontSize:14,color:t.direction==='credit'?'var(--green)':'var(--red)'}}>
                  {t.direction==='credit'?'+':'-'}₹{Number(t.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}