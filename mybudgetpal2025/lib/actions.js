/**
 * SERVER ACTIONS FOR AUTHENTICATION
 * 
 *  This file contains all server-side authentication actions for the app.
 * Server actions run ONLY on the server and are called from client components.
 * 
 * Key Features:
 * - User registration (signup) with email/password or Google OAuth
 * - User login with credentials validation
 * - User logout with session cleanup
 * 
 * 
 *  Security Notes:
 * - Passwords are hashed using bcrypt before storing in database
 * - Input validation happens before any database queries
 * 
 */
'use server'
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { signIn, signOut, auth } from '@/app/auth'
import { revalidatePath } from 'next/cache'


/**
 * SIGNUP ACTION
 * 
 * Handles user registration with email/password or Google OAuth
 * 
 * Flow:
 * 1. Extract form data (name, email, password, google) from SignUpPage
 * 2.  If Google signup → redirect to Google OAuth
 * 3.  If Credentials (email/password) signup:
 *    a. Validate inputs (email format, password length, required fields)
 *    b. Check if email already exists in database
 *    c. Hash password with bcrypt (10 salt rounds = secure but not too slow)
 *    d. Create new user in database
 *    e. Redirect to login page
 * 
 * @param {*} prevState Previous state from useActionState hook (unused here)
 * @param {*} formData  Form data from the signup form (gets all data entered in signup form)
 */
export async function signUp(prevState, formData) {

    /**
     * Extracts all fields from formData object
     * uses their name attribute (important)
     */
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    // const google = formData.get('google')  // This will be 'google' if Google button clicked

    /**
     * Handling Google OAuth
     * If user clicked "Sign up with Google" button, redirect to Google OAuth flow
     */
    // if (google === 'google') {
    //     await signIn(google, {redirectTo: "/dashboard"})
    //     return;

    // }

    //track if user was successfully created
    let userCreated = false

try {
    /**
     * INPUT VALIDATION LOGIC
     * Validates all inputs before touching the database
     */

    //checks if email and password are provided
    if(!email || !password){
        return{
            error: "No email or password entered, please ensure you do so"
        }
    }

    //enforces minimum password length of 6 characters
    if(password.length < 6 ){
        return{
            error: 'Please enter a password of at least 6 charcaters'
        }
    }

    //enforces email validation that checks for @ symbol
    if(!email.includes('@')){
        return{
            error: "Invalid email"
        }
    }

    /**
     * Check if email already exists
     * 
     * Query the database to see if this email is already in our database
     */
    const registeredEmail = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    //if email exists, prevent duplicate registration
    if(registeredEmail){
        return{
            error: 'Email already registered'
        }
    }

    //hashes the password.
    //we don't want to store plain text passwords in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    //creates a new user, by querying the database and assigning formData objects respectively
    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })

    //if we've got here, user was created successfully
    userCreated = true

    } catch (error) {
        //catch any unexpected errors
        return{
            error: 'Something went wrong with creating the user'
        }
    }

    //if user creation was successful, redirect to login
    if (userCreated) {
        redirect('/login')

    }

}

/**
 * Handles user login with email and password credentials
 * 
 * Flow:
 * 1. Extract email and password from form
 * 2. Call NextAuth's signIn with 'credentials' provider
 * 3. NextAuth will:
 *    a. Call the authorize() function in auth.js
 *    b. Verify credentials against database
 *    c. Create session if credentials valid
 *    d. Redirect to dashboard if successful
 * 
 * @param {*} prevState 
 * @param {*} formData 
 * @returns 
 */
export async function login(prevState, formData) {
    const email = formData.get('email')
    const password = formData.get('password')

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: "/dashboard" // where to go if logging in is successful
        })
    } catch (error) {
        //catches any errors
        if (error.type === 'CredentialsSignin') {
            return { error: 'Invalid email or password' };
        }
        throw error;
    }
}

/**
 * LOGOUT ACTION
 * 
 * Handles user logout
 * 
 * redirects back to home page
 * @param {*} prevState 
 * @param {*} formData 
 */
export async function logout(prevState, formData) {
    await signOut({redirectTo: '/'})
}

/**
 * ADD EXPENSE ACTION
 * Allows the user to add expenses to their profile
 * @param {*} prevState 
 * @param {*} formData 
 * @returns 
 */
export async function addExpense(prevState, formData) {

    const session = await auth()

    /**
     * Check if the user trying to add en expense is logged in
     */
    if (!session?.user) {
        return{
            error: 'You must be logged in to add an expense'
        }
    }

    //Gets the current user session
    const currentUser = session.user.id


    /**
     * Form Data that will be created in dashboard eventually
     * 
     * Wrapped amount with an int since it's initially returned as a string.
     * But the type in our schema.prisma is Int so they have to be the same else an error occurs.
     * 
     * Also updated categoryTyepe to ensure that if user types 'food' it updates to 'FOOD'
     * This is because category types are capitalized in schema.prisma, so they should match
     */
    const amount = parseFloat(formData.get('amount')) 

    const description = formData.get('description')

    const categoryType = formData.get('categoryType').toUpperCase()

    /**
     * Validation check to ensure an amount and a description is entered
     */
    if (!amount || !description) {
        return{
            error: 'Please enter an amount and description to add an expense'
        }
    }

    /**
     * Will create the amount, description, and category type (FOOD, ENTERTAINMENT, RENT, OTHER) of an expense based on the user who's logged in
     */
    const addedExpense = await prisma.expense.create({
        data: {
            amount: amount,
            description: description,
            categoryType: categoryType,
            /**
             * This tells the Expense model which user it belongs to
             * Since userId is our foreign key that connects to User, we assign the current user's session to it.
             */
            userId: currentUser
        }
    })

    /**
     * This refreshes the page automatically when an expense is added
     * Without this, the user CAN add an expense. BUT would have to manually refresh the window to see the update
     */
    revalidatePath('/dashboard')


    //success message
    return{
        message: 'Expense added successfully'
    }

}

export async function deleteExpense(prevState,formData) {
    

    const session = await auth()

    //checks if the user is logged in. A user needs to be logged in, in order to use the functionality
    if(!session?.user){
        return{
            error: 'You must be logged in to delete an expense'
        }
    }

    /**
     * Store the current users id 
     * As well as store the expense id of an expense
     */
    const currentUser = session.user.id
    
    const expenseId = formData.get('id')


    /**
     * Delete an expense based on its id and
     * based on the id of the current user for security
     */
    await prisma.expense.delete({
        where: {
            id: expenseId,
            userId: currentUser
        }
    })

    //refreshes page automatically
    revalidatePath('/dashboard')


    //success message
    return{
        message: 'Expense deleted successfully'
    }
}

export async function editExpense(prevState, formData) {

    const session = await auth()

    if(!session.user){
        return{
            error: 'Need to be logged in to edit an expense!'
        }
    }

    const loggedInUser = session.user.id

    const expenseId = formData.get('id')
    const amount = parseFloat(formData.get('amount'))
    const description = formData.get('description')
    const categoryType = formData.get('categoryType')

    if (!amount || !description) {
        return{
            error: 'Please enter an amount or description to move forward'
        }
    }

    await prisma.expense.update({
        where: {
            id : expenseId,
            userId: loggedInUser
        },
        data: {
            amount: amount,
            description: description,
            categoryType: categoryType
        }
    })

    revalidatePath('/dashboard')

    return{
        message: 'Expense updated successfully'
    }
}