import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const inputStyle = {
  width:'100%', padding:'13px 16px', borderRadius:12,
  border:'1px solid var(--border)', background:'var(--surface)',
  color:'var(--text)', fontSize:15, fontWeight:500,
  outline:'none', transition:'border 0.2s, background 0.2s',
  marginBottom:'1.1rem', fontFamily:'DM Sans, sans-serif'
}
const labelStyle = {
  display:'block', fontSize:11, fontWeight:600, color:'var(--text-3)',
  letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:6
}
const focus = e => { e.target.style.borderColor='rgba(124,58,237,0.5)'; e.target.style.background='rgba(124,58,237,0.06)' }
const blur = e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--surface)' }

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({name:'',email:'',phone:'',password:''})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name||!form.email||!form.phone||!form.password) return toast.error('Fill all fields')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Account created!')
      navigate('/login')
    } catch(e) { toast.error(e.response?.data?.detail||'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',position:'relative',overflow:'hidden'}}>
      <div style={{position:'fixed',top:'-100px',right:'-100px',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.2),transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'fixed',bottom:'-80px',left:'-80px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(52,211,153,0.08),transparent 70%)',pointerEvents:'none'}}/>

      <div style={{width:'100%',maxWidth:400,background:'rgba(13,13,24,0.95)',border:'1px solid var(--border)',borderRadius:24,padding:'2.5rem',backdropFilter:'blur(20px)'}}>
        <div style={{width:64,height:64,borderRadius:20,background:'linear-gradient(135deg,#7c3aed,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',fontSize:'1.8rem'}}>💸</div>
        <h1 style={{textAlign:'center',fontSize:'1.6rem',fontWeight:700,marginBottom:4}}>Create account</h1>
        <p style={{textAlign:'center',color:'var(--text-2)',fontSize:13,marginBottom:'2rem'}}>Join PayFlow today</p>

        <label style={labelStyle}>Full name</label>
        <input style={inputStyle} placeholder="John Doe" value={form.name}
          onChange={e=>setForm({...form,name:e.target.value})} onFocus={focus} onBlur={blur}/>

        <label style={labelStyle}>Email</label>
        <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})} onFocus={focus} onBlur={blur}/>

        <label style={labelStyle}>Phone number</label>
        <input style={inputStyle} type="tel" placeholder="9876543210" value={form.phone}
          onChange={e=>setForm({...form,phone:e.target.value})} onFocus={focus} onBlur={blur}/>

        <label style={labelStyle}>Password</label>
        <input style={{...inputStyle,marginBottom:'1.75rem'}} type="password" placeholder="Min 6 characters" value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})} onFocus={focus} onBlur={blur}
          onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>

        <button onClick={handleSubmit} disabled={loading}
          style={{width:'100%',padding:'15px',background:'linear-gradient(135deg,#7c3aed,#a78bfa)',color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',letterSpacing:'0.3px'}}>
          {loading?'Creating...':'Create account →'}
        </button>

        <p style={{textAlign:'center',marginTop:'1.5rem',color:'var(--text-2)',fontSize:13}}>
          Already have an account?{' '}
          <Link to="/login" style={{color:'#a78bfa',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}