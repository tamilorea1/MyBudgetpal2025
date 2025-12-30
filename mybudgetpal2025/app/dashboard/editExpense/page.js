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

    return (

    //If edit button is clicked, open the modal
    <div>
        <button onClick={() => setOpen(true)}>
            <Pencil size={18}/>
        </button>


    {/**
     * pass the amount, description and category type to the modal so it can be edited.
     */}
        {open && <EditExpenseModal onClose={() => setOpen(false)} id={id} amount={amount} description={description} categoryType={categoryType}/>}


    </div>
  )
}
