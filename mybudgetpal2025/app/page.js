// app/page.js
import Link from "next/link"

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Soft professional gradient
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          background: '#e0f2fe',
          color: '#0369a1',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          Personal Finance Manager
        </div>

        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          color: '#1a1a1a', 
          margin: '0 0 16px 0',
          letterSpacing: '-1px'
        }}>
          Welcome to <span style={{ color: '#2563eb' }}>BudgetPal</span>
        </h1>

        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
          Take control of your spending with our modern, data-driven dashboard.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/signup" style={{
            background: '#2563eb',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}>
            Create your account
          </Link>

          <Link href="/login" style={{
            background: 'white',
            color: '#1a1a1a',
            padding: '16px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            border: '1px solid #e5e7eb',
            transition: 'background 0.2s ease'
          }}>
            Log in to your dashboard
          </Link>
        </div>
      </div>
      
      <p style={{ marginTop: '24px', fontSize: '0.85rem', color: '#888' }}>
        Built for the modern budgeter.
      </p>
    </main>
  )
}