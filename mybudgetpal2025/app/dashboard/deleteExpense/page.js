'use client'
import { deleteExpense } from '@/lib/actions'
import { useActionState } from 'react'
import { Trash2 } from 'lucide-react'

export default function DeleteExpenseFormPage({id}) {

    const initialState = {message: null, error: null}

    const [state, formAction, isPending] = useActionState(deleteExpense, initialState)

return (
  <div style={{ display: 'inline-block' }}>
    <form action={formAction}>
      {/* Hidden input to store the expense ID */}
      <input type='hidden' name='id' value={id}/>
      
      <button 
        type='submit' 
        disabled={isPending}
        style={{ 
          background: 'none',
          border: '1px solid #fee2e2', // Very light red border
          padding: '8px',
          borderRadius: '8px',
          color: '#ef4444', // Professional red
          cursor: isPending ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          opacity: isPending ? 0.5 : 1,
        }}
        // Adding a hover effect via standard JS for simplicity
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fef2f2';
          e.currentTarget.style.borderColor = '#fecaca';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.borderColor = '#fee2e2';
        }}
      >
        {isPending ? (
          <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>...</span>
        ) : (
          <Trash2 size={16} />
        )}
      </button>

      {/* Error Feedback */}
      {state.error && (
        <p style={{ 
          position: 'absolute', 
          color: '#dc2626', 
          fontSize: '0.7rem', 
          marginTop: '4px' 
        }}>
          {state.error}
        </p>
      )}
    </form>
  </div>
)
}