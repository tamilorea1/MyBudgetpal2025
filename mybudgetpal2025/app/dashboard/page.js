import { auth } from '../auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LogoutPage from '../components/logout/page'
import ExpenseFormPage from './expenseForm/page'
import {prisma} from '@/lib/prisma'
import DeleteExpenseFormPage from './deleteExpense/page'
import EditExpensePage from './editExpense/page'
import Link from "next/link"
import styles from './dashboard.module.css'
import AnalyticsChartPage from '../components/analytics/page'

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
 * 1. Async SearchParams: searchParams is a Promise that must be awaited.
 * 2. URL State Management: Using the URL (?category=X) as the "Source of Truth" for filtering.
 * 3. Server-Side Filtering: Prisma filters data at the database level, not in the browser.
 *
 */
export default async function DashboardPage({searchParams}) {

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
   * 1. EXTRACT FILTER FROM URL
   * We 'await' the searchParams promise to get the current query parameters.
   * If the URL is /dashboard?category=FOOD, then selectedCategory = "FOOD".
   */
  const params = await searchParams

  const selectedCategory = params.category
  
  /**
   * Gets all the information (amount & description) of every expense based on the logged in user
   * 
   * We pass the category directly to Prisma. 
   * 'undefined' is a special Prisma trick: if selectedCategory is null (the "ALL" link),
   * Prisma ignores this filter entirely and returns all records.
   */
  const getUserData = await prisma.expense.findMany({
    where:{
      userId: loggedInUser,
      categoryType: selectedCategory ? selectedCategory : undefined
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  /**
   * GROUPS EXPENSES BY ITS CATEGORY TYPE
   * This returns something like this:
   * groupBy = {
   * FOOD: 20.50,
   * RENT: 1200.00,
   * ENTERTAINMENT: 50.00,
   * OTHER: 100.00
   * }
   */
  const groupBy =  getUserData.reduce((acc, expense) => {
      const category = expense.categoryType

      //If the category doesn't exist in our accumulator yet, start with 0
      if(!acc[category]){
        acc[category] = 0
      }

      //add the current expense amount to that category's total
      acc[category] += expense.amount
      return acc
    }, {})
  

  /**
   * Converts object into an array of objects
   * Gives the array of objects a name : value pair making it easy for rechart to use
   */
  const groupedCategory = Object.keys(groupBy).map((category) => ({
    name: category,
    value: groupBy[category]
  }))

  /**
   * Logic to calculate and update total balance
   */
  const totalBalance = getUserData.reduce((accumulator, expense) => {
    return accumulator + expense.amount
  }, 0)


  const hasData = getUserData.length > 0

  /**
   * Dashboard with styled components
   */
  return (
    <div className={styles.container}>
      
      {/* Header with user info and logout */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Image
            src={session?.user.image}
            alt={session?.user.name}
            width={72}
            height={72}
            className={styles.profileImage}
          />
          <div className={styles.userDetails}>
            <p className={styles.userName}>{session?.user.name}</p>
            <p className={styles.userEmail}>{session?.user.email}</p>
          </div>
        </div>
        <LogoutPage/>
      </div>

      {/* Add Expense Form */}
      <ExpenseFormPage/>

      {/* Total Balance Card */}
      <div className={styles.balanceCard}>
        <p className={styles.balanceLabel}>Total Balance</p>
        <h2 className={styles.balanceAmount}>${totalBalance.toFixed(2)}</h2>
      </div>

      {/*Recharts illustration */}
      {hasData ? (
        <AnalyticsChartPage data={groupedCategory}/>
      ) : (
        <p>Add some expenses to see your spending breakdown</p>
      )}

      {/* Category Filter Navigation */}
      <nav className={styles.filterNav}>
        <Link 
          href='/dashboard' 
          className={!selectedCategory ? `${styles.filterLink} ${styles.filterLinkActive}` : styles.filterLink}
        >
          ALL
        </Link>
        <Link 
          href='/dashboard?category=FOOD' 
          className={selectedCategory === 'FOOD' ? `${styles.filterLink} ${styles.filterLinkActive}` : styles.filterLink}
        >
          FOOD
        </Link>
        <Link 
          href='/dashboard?category=RENT' 
          className={selectedCategory === 'RENT' ? `${styles.filterLink} ${styles.filterLinkActive}` : styles.filterLink}
        >
          RENT
        </Link>
        <Link 
          href='/dashboard?category=ENTERTAINMENT' 
          className={selectedCategory === 'ENTERTAINMENT' ? `${styles.filterLink} ${styles.filterLinkActive}` : styles.filterLink}
        >
          ENTERTAINMENT
        </Link>
        <Link 
          href='/dashboard?category=OTHER' 
          className={selectedCategory === 'OTHER' ? `${styles.filterLink} ${styles.filterLinkActive}` : styles.filterLink}
        >
          OTHER
        </Link>
      </nav>

      {/* Expenses List */}
      <div className={styles.expensesList}>
        {getUserData.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>
              No expenses yet. Add your first expense above!
            </p>
          </div>
        ) : (
          getUserData.map((expense) => (
            <div key={expense.id} className={styles.expenseCard}>
              <div className={styles.expenseInfo}>
                <h3 className={styles.expenseDescription}>{expense.description}</h3>
                <span className={`${styles.expenseCategory} ${styles[`category${expense.categoryType.charAt(0) + expense.categoryType.slice(1).toLowerCase()}`]}`}>
                  {expense.categoryType}
                </span>
                <p className={styles.expenseAmount}>
                  ${expense.amount.toFixed(2)}
                </p>
              </div>

              <div className={styles.expenseActions}>
                {/* Edit expense component */}
                <EditExpensePage 
                  id={expense.id} 
                  amount={expense.amount} 
                  description={expense.description} 
                  categoryType={expense.categoryType}
                />
                
                {/* Delete component */}
                <DeleteExpenseFormPage id={expense.id} />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
