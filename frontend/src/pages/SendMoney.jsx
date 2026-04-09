import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const iStyle = {
  width:'100%',padding:'13px 16px',borderRadius:12,border:'1px solid var(--border)',
  background:'var(--surface)',color:'var(--text)',fontSize:15,fontWeight:500,
  outline:'none',transition:'border 0.2s,background 0.2s',fontFamily:'DM Sans,sans-serif',
  marginBottom:'1.25rem'
}
const focus = e => { e.target.style.borderColor='rgba(124,58,237,0.5)'; e.target.style.background='rgba(124,58,237,0.06)' }
const blur  = e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--surface)' }
const lbl   = { display:'block',fontSize:11,fontWeight:600,color:'var(--text-3)',letterSpacing:'0.8px',textTransform:'uppercase',marginBottom:6 }

export default function SendMoney() {
  const navigate = useNavigate()
  const [form, setForm] = useState({receiver_phone:'',amount:'',note:''})
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!form.receiver_phone||!form.amount) return toast.error('Phone and amount required')
    if (parseFloat(form.amount)<=0) return toast.error('Amount must be positive')
    setLoading(true)
    try {
      const {data} = await api.post('/transactions/send',{
        receiver_phone:form.receiver_phone,
        amount:parseFloat(form.amount),
        note:form.note
      })
      toast.success(data.message)
      navigate('/')
    } catch(e){ toast.error(e.response?.data?.detail||'Transfer failed') }
    finally{ setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(160deg,#1a0533,var(--bg2))',padding:'1.5rem 1.25rem 3.5rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-60px',right:'-60px',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{display:'flex',alignItems:'center',gap:12,maxWidth:480,margin:'0 auto',position:'relative'}}>
          <button onClick={()=>navigate('/')}
            style={{width:38,height:38,borderRadius:10,background:'rgba(255,255,255,0.06)',border:'1px solid var(--border)',color:'var(--text)',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            ←
          </button>
          <div>
            <p style={{fontWeight:700,fontSize:'1.2rem'}}>Send Money</p>
            <p style={{color:'var(--text-3)',fontSize:12}}>Transfer to anyone instantly</p>
          </div>
        </div>
      </div>

      <div style={{maxWidth:480,margin:'-2.5rem auto 0',padding:'0 1rem 2rem',position:'relative'}}>
        <div style={{background:'rgba(13,13,24,0.98)',border:'1px solid rgba(124,58,237,0.15)',borderRadius:22,padding:'1.75rem',backdropFilter:'blur(20px)'}}>

          <label style={lbl}>Receiver phone</label>
          <div style={{position:'relative',marginBottom:'1.25rem'}}>
            <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:14,color:'var(--text-3)'}}>📱</span>
            <input placeholder="e.g. 9876543210" value={form.receiver_phone}
              onChange={e=>setForm({...form,receiver_phone:e.target.value})} type="tel"
              style={{...iStyle,paddingLeft:40,marginBottom:0}}
              onFocus={focus} onBlur={blur}/>
          </div>

          <label style={lbl}>Amount</label>
          <div style={{background:'rgba(124,58,237,0.06)',border:'1px solid rgba(124,58,237,0.2)',borderRadius:12,padding:'16px',marginBottom:'1.25rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{color:'var(--purple-light)',fontSize:22,fontWeight:700}}>₹</span>
              <input placeholder="0.00" value={form.amount}
                onChange={e=>setForm({...form,amount:e.target.value})} type="number"
                style={{background:'transparent',border:'none',color:'var(--text)',fontSize:28,fontWeight:700,outline:'none',fontFamily:'DM Sans,sans-serif',width:'100%',letterSpacing:'-0.5px'}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:6,marginBottom:'1.25rem'}}>
            {[100,500,1000,2000].map(a=>(
              <button key={a} onClick={()=>setForm({...form,amount:String(a)})}
                style={{flex:1,padding:'8px 0',background:'rgba(124,58,237,0.08)',border:'1px solid rgba(124,58,237,0.15)',borderRadius:8,color:'#a78bfa',fontWeight:600,fontSize:12,cursor:'pointer'}}>
                ₹{a}
              </button>
            ))}
          </div>

          <label style={lbl}>Note (optional)</label>
          <input placeholder="e.g. For lunch, Rent..." value={form.note}
            onChange={e=>setForm({...form,note:e.target.value})}
            style={iStyle} onFocus={focus} onBlur={blur}/>

          <button onClick={handleSend} disabled={loading}
            style={{width:'100%',padding:'15px',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',marginTop:4,letterSpacing:'0.3px'}}>
            {loading ? 'Sending...' : '💸 Send Money'}
          </button>
        </div>
      </div>
    </div>
  )
}