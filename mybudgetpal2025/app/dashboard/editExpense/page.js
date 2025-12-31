'use client'
import React, { useState } from 'react'
import EditExpenseModal from './editModal/page'
import { Pencil } from 'lucide-react'
/**
 * Passed props which will show pre populated data of the previously entered amount, description, and category type
 * @param {*} param0 
 * @returns 
 */
export default function EditExpensePage({
    id,
    amount,
    description,
    categoryType
}) {
  

    /**
     * Used for checking the state of our modal
     */
    const [open, setOpen] = useState(false)

    // app/dashboard/editExpense/page.js
return (
  <div style={{ display: 'inline-block' }}>
    {/* The Edit Trigger Button */}
    <button 
      onClick={() => setOpen(true)}
        style={{ 
        background: 'none',
        border: '1px solid #e2e8f0', // Light slate border
        padding: '8px',
        borderRadius: '8px',
        color: '#64748b', // Professional slate grey
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
      // Interactive hover effects
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f8fafc';
        e.currentTarget.style.borderColor = '#cbd5e1';
        e.currentTarget.style.color = '#334155';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.color = '#64748b';
      }}
    >
      <Pencil size={16} />
    </button>

    {/* The Modal Component */}
    {/**
     * pass the amount, description and category type to the modal so it can be edited.
     */}
    {open && (
      <EditExpenseModal 
        onClose={() => setOpen(false)} 
        id={id} 
        amount={amount} 
        description={description} 
        categoryType={categoryType}
      />
    )}
  </div>
)
}
