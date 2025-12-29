import React from 'react'
import { editExpense } from '@/lib/actions'
import './EditExpenseModal.css'
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
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Header */}
                <div className="modal-header">
                    <h2>Edit Expense</h2>
                    <p>Update your expense details</p>
                </div>

                {/* Form */}
                <form action={formAction} className="modal-form">
                    <input type='hidden' name='id' value={id}/>

                    {/* Amount Input */}
                    <div className="form-group">
                        <label>Amount</label>
                        
                            <input
                                type='number'
                                defaultValue={amount}
                                name='amount'
                                step="0.01"
                                placeholder="0.00"
                            />
                    </div>

                    {/* Description Input */}
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type='text'
                            defaultValue={description}
                            name='description'
                            placeholder="What did you spend on?"
                        />
                    </div>

                    {/* Category Select */}
                    <div className="form-group">
                        <label>Category</label>
                        <select name='categoryType' defaultValue={categoryType}>
                            <option value='FOOD'>🍔 Food</option>
                            <option value='RENT'>🏠 Rent</option>
                            <option value='ENTERTAINMENT'>🎮 Entertainment</option>
                            <option value='OTHER'>📦 Other</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="button-group">
                        <button type='submit' className="btn-primary">
                            {isPending ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                        <button type='button' onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>

                        {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
                        {state?.message && <p style={{ color: 'red' }}>{state.message}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
}
