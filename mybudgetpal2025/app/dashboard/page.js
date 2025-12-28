
import { auth } from '../auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LogoutPage from '../components/logout/page'
import ExpenseFormPage from './expenseForm/page'
import {prisma} from '@/lib/prisma'
import DeleteExpenseFormPage from './deleteExpense/page'
import EditExpensePage from './editExpense/page'

/**
 * PAGE 2: DASHBOARD PAGE
 * Purpose:
 * - Main page after user logs in
 * - Protected route (only authenticated users can access)
 * - Displays user information and app content
 * 
 * Security:
 * - Checks if user is authenticated before rendering
 * - Redirects to home page if not logged in
 * - Session data contains: user.id, user.name, user.email, user.image
 * 
 */
export default async function DashboardPage() {

  /**
   * returns session object if user is logged in
   * returns null otherwise
   * 
   * Session structure:
   *  {
   *   user: {
   *     id: "user-id-here",
   *     name: "John Doe",
   *     email: "john@example.com",
   *     image: "https://profile-image-url.com/photo.jpg"
   *   },
   *   expires: "2024-12-31T23:59:59.999Z"
   * }
   */
  const session = await auth()


  /**
   * Authentication Guard
   * if user doesn't exist and they're trying to access this page
   * redirect back to home page
   */
  if(!session?.user){
    redirect("/")
  }

  const loggedInUser = session.user.id

  /**
   * Gets all the information (amount & description) of every expense based on the logged in user
   */
  const getUserData = await prisma.expense.findMany({
    where:{
      userId: loggedInUser
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  /**
   * Logic to calculate and update total balance
   */
  const totalBalance = getUserData.reduce((accumulator, expense) => {
    return accumulator + expense.amount
  }, 0)



  /**
   * Just displays user name, email and image.
   */
  return (
    <div>
      WE MADE IT TO THE dashboard

      <p>{session?.user.name}</p>
      <p>{session?.user.email}</p>

      <Image
      src={session?.user.image}
      alt={session?.user.name}
      width={72}
      height={72}
      />

      <ExpenseFormPage/>

      <div>
        ${totalBalance.toFixed(2)}
      </div>

      <div>
        {getUserData.map((expense) => (
        <div key={expense.id} style={{ 
          border: '1px solid #ddd', 
          padding: '15px', 
          margin: '10px 0', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0 }}>{expense.description}</h3>
            <span style={{ fontSize: '0.8rem', color: '#666', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
              {expense.categoryType}
            </span>
            <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>
              ${expense.amount.toFixed(2)}
            </p>
        </div>

          {/* Delete component */}
          <DeleteExpenseFormPage id={expense.id} />

          {/*Edit expense component */}
          <EditExpensePage id={expense.id} amount={expense.amount} description={expense.description} categoryType={expense.categoryType}/>
      </div>
))}
        
      </div>
  
      <LogoutPage/>

    </div>
  )
}
