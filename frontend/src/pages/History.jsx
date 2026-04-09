import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function History() {
  const navigate = useNavigate()
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(()=>{
    api.get('/transactions/history').then(r=>setTxns(r.data)).finally(()=>setLoading(false))
  },[])

  const filtered = filter==='all' ? txns : txns.filter(t=>t.direction===filter)
  const totalIn  = txns.filter(t=>t.direction==='credit').reduce((s,t)=>s+t.amount,0)
  const totalOut = txns.filter(t=>t.direction==='debit').reduce((s,t)=>s+t.amount,0)
  const fmt = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <div style={{background:'linear-gradient(160deg,#1a0533,var(--bg2))',padding:'1.5rem 1.25rem 3.5rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-60px',right:'-60px',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:480,margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.25rem'}}>
            <button onClick={()=>navigate('/')}
              style={{width:38,height:38,borderRadius:10,background:'rgba(255,255,255,0.06)',border:'1px solid var(--border)',color:'var(--text)',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              ←
            </button>
            <div>
              <p style={{fontWeight:700,fontSize:'1.2rem'}}>Transaction History</p>
              <p style={{color:'var(--text-3)',fontSize:12}}>{txns.length} transactions total</p>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div style={{background:'rgba(52,211,153,0.08)',border:'1px solid rgba(52,211,153,0.15)',borderRadius:14,padding:'1rem'}}>
              <p style={{color:'var(--text-3)',fontSize:11,fontWeight:600,letterSpacing:'0.5px'}}>TOTAL IN</p>
              <p style={{color:'var(--green)',fontSize:'1.3rem',fontWeight:700,marginTop:4}}>+₹{totalIn.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.15)',borderRadius:14,padding:'1rem'}}>
              <p style={{color:'var(--text-3)',fontSize:11,fontWeight:600,letterSpacing:'0.5px'}}>TOTAL OUT</p>
              <p style={{color:'var(--red)',fontSize:'1.3rem',fontWeight:700,marginTop:4}}>-₹{totalOut.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:480,margin:'-2rem auto 0',padding:'0 1rem 2rem',position:'relative'}}>
        {/* Filter */}
        <div style={{background:'rgba(13,13,24,0.98)',border:'1px solid var(--border)',borderRadius:14,padding:'5px',display:'flex',gap:4,marginBottom:'1rem'}}>
          {['all','credit','debit'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{flex:1,padding:'9px',borderRadius:10,border:'none',fontWeight:600,fontSize:12,cursor:'pointer',transition:'all 0.2s',
                background:filter===f?'linear-gradient(135deg,#7c3aed,#a78bfa)':'transparent',
                color:filter===f?'#fff':'var(--text-2)',fontFamily:'DM Sans,sans-serif'}}>
              {f==='all'?'All':f==='credit'?'Money In':'Money Out'}
            </button>
          ))}
        </div>

        {loading && <p style={{textAlign:'center',color:'var(--text-3)',padding:'2rem',fontWeight:500}}>Loading...</p>}

        {!loading&&filtered.length===0 && (
          <div style={{textAlign:'center',padding:'3rem',color:'var(--text-3)'}}>
            <div style={{fontSize:'3rem',marginBottom:'0.75rem'}}>📭</div>
            <p style={{fontWeight:500}}>No transactions found</p>
          </div>
        )}

        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          {filtered.map(t=>(
            <div key={t.id} style={{background:'rgba(13,13,24,0.98)',border:'1px solid var(--border)',borderRadius:16,padding:'1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border-color 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(124,58,237,0.25)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:42,height:42,borderRadius:12,background:t.direction==='credit'?'var(--green-dim)':'var(--red-dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>
                  {t.direction==='credit'?'⬇':'⬆'}
                </div>
                <div>
                  <p style={{fontSize:14,fontWeight:500,color:'var(--text)'}}>{t.note||(t.direction==='credit'?'Money received':'Money sent')}</p>
                  <p style={{fontSize:11,color:'var(--text-3)',marginTop:3}}>{fmt(t.created_at)}</p>
                </div>
              </div>
              <div style={{textAlign:'right',flexShrink:0,marginLeft:12}}>
                <p style={{fontWeight:700,fontSize:15,color:t.direction==='credit'?'var(--green)':'var(--red)'}}>
                  {t.direction==='credit'?'+':'-'}₹{Number(t.amount).toFixed(2)}
                </p>
                <span style={{fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:20,marginTop:3,display:'inline-block',
                  background:t.direction==='credit'?'rgba(52,211,153,0.1)':'rgba(248,113,113,0.1)',
                  color:t.direction==='credit'?'var(--green)':'var(--red)'}}>
                  {t.direction==='credit'?'received':'sent'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}