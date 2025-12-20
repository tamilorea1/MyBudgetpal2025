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
import { signIn, signOut } from '@/app/auth'


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
    const google = formData.get('google')  // This will be 'google' if Google button clicked

    /**
     * Handling Google OAuth
     * If user clicked "Sign up with Google" button, redirect to Google OAuth flow
     */
    if (google === 'google') {
        await signIn(google, {redirectTo: "/dashboard"})
        return;

    }

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