'use client'
import { logout } from "@/lib/actions"

export default function LogoutPage() {
  return (
    <form action={logout}>
      <button
        type="submit"
        style={{
          background: '#fee2e2',
          color: '#dc2626',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
      >
        Logout
      </button>
    </form>
  )
}
