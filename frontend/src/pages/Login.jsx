import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const s = {
  page: { minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', position:'relative', overflow:'hidden' },
  glow1: { position:'fixed', top:'-100px', right:'-100px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', pointerEvents:'none' },
  glow2: { position:'fixed', bottom:'-80px', left:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)', pointerEvents:'none' },
  card: { width:'100%', maxWidth:400, background:'rgba(13,13,24,0.95)', border:'1px solid var(--border)', borderRadius:24, padding:'2.5rem', backdropFilter:'blur(20px)' },
  logo: { width:64, height:64, borderRadius:20, background:'linear-gradient(135deg,#7c3aed,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'1.8rem' },
  label: { display:'block', fontSize:11, fontWeight:600, color:'var(--text-3)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:6 },
  input: { width:'100%', padding:'13px 16px', borderRadius:12, border:'1px solid var(--border)', background:'var(--surface)', color:'var(--text)', fontSize:15, fontWeight:500, outline:'none', transition:'border 0.2s, background 0.2s', marginBottom:'1.2rem' },
  btn: { width:'100%', padding:'15px', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', color:'#fff', border:'none', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer', letterSpacing:'0.3px', transition:'opacity 0.2s, transform 0.15s' },
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)

  const focus = e => { e.target.style.borderColor='var(--border-focus)'; e.target.style.background='rgba(124,58,237,0.06)' }
  const blur = e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--surface)' }

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error('Fill all fields')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch(e) { toast.error(e.response?.data?.detail || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <div style={s.glow1}/><div style={s.glow2}/>
      <div style={s.card}>
        <div style={s.logo}>💸</div>
        <h1 style={{textAlign:'center',fontSize:'1.8rem',fontWeight:700,letterSpacing:'-0.5px',marginBottom:4}}>PayFlow</h1>
        <p style={{textAlign:'center',color:'var(--text-2)',fontSize:13,marginBottom:'2rem'}}>Your premium digital wallet</p>

        <label style={s.label}>Email address</label>
        <input style={s.input} type="email" placeholder="you@example.com"
          value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
          onFocus={focus} onBlur={blur}/>

        <label style={s.label}>Password</label>
        <input style={{...s.input,marginBottom:'1.75rem'}} type="password" placeholder="••••••••"
          value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
          onFocus={focus} onBlur={blur}
          onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>

        <button style={s.btn} onClick={handleSubmit} disabled={loading}
          onMouseEnter={e=>e.target.style.opacity='0.9'}
          onMouseLeave={e=>e.target.style.opacity='1'}>
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>

        <p style={{textAlign:'center',marginTop:'1.5rem',color:'var(--text-2)',fontSize:13}}>
          No account?{' '}
          <Link to="/register" style={{color:'var(--purple-light)',fontWeight:600,textDecoration:'none'}}>Create one</Link>
        </p>
      </div>
    </div>
  )
}