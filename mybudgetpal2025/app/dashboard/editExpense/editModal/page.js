'use client'
import { editExpense } from '@/lib/actions'
import { useActionState, useEffect } from 'react'

export default function EditExpenseModal({
    onClose,
    id,
    amount,
    description,
    categoryType
}) {

    /**
     * If the user clicks save changes, it will refresh the page with the updated expenses
     * @param {*} formData 
     */
    const handleSubmit = async (formData) => {
        await editExpense(formData);
        onClose();
    }


    const initialState = {message: null, error: null}

    const [state, formAction, isPending] = useActionState(editExpense, initialState)

    useEffect(() => {
    // If we have a success message, close the modal
    if (state?.message === 'Expense updated successfully') {
        onClose();
        }
    }, [state, onClose])

    /**
     * We use defaultValue since we are using server actions
     * We'd only use 'value' if it was accompanied by some state like useState
     * if value is used instead, the pre filled data would be read only
     */

return (
    <div 
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.4)', // Slate-tinted overlay
        backdropFilter: 'blur(8px)', // Modern glass effect
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    }}>
        <div 
            style={{
            background: 'white',
            width: '100%',
            maxWidth: '450px',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>
                    Edit Expense
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                    Update your spending details below.
                </p>
            </div>

            {/* Form */}
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type='hidden' name='id' value={id}/>

                {/* Amount Input */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Amount</label>
                    <input
                        type='number'
                        defaultValue={amount}
                        name='amount'
                        step="0.01"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Description</label>
                    <input
                        type='text'
                        defaultValue={description}
                        name='description'
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                    />
                </div>

                {/* Category Select */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Category</label>
                    <select name='categoryType' defaultValue={categoryType} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', cursor: 'pointer', outline: 'none' }}>
                        <option value='FOOD'>Food</option>
                        <option value='RENT'>Rent</option>
                        <option value='ENTERTAINMENT'>Entertainment</option>
                        <option value='OTHER'>Other</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button type='submit' disabled={isPending} style={{ flex: 2, background: '#2563eb', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type='button' onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>

                {state?.error && <p style={{ color: '#dc2626', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{state.error}</p>}
            </form>
        </div>
    </div>
)
}
