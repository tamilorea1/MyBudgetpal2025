'use server'
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function signUp(prevState, formData) {
    try {
        const name = formData.get('name')
        const email = formData.get('email')
        const password = formData.get('password')

    if(!email || !password){
        return{
            error: "No email or password entered, please ensure you do so"
        }
    }

    if(password.length < 6 ){
        return{
            error: 'Please enter a password of at least 6 charcaters'
        }
    }

    if(!email.includes('@')){
        return{
            error: "Invalid email"
        }
    }

    const registeredEmail = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(registeredEmail){
        return{
            error: 'Email already registered'
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })



    } catch (error) {
        return{
            error: 'Something went wrong with creating the user'
        }
    }

    redirect('/login')


    

}