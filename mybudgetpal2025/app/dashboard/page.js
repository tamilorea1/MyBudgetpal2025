import { auth } from '../auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LogoutPage from '../components/logout/page'
import ExpenseFormPage from './expenseForm/page'
import {prisma} from '@/lib/prisma'
import DeleteExpenseFormPage from './deleteExpense/page'
import EditExpensePage from './editExpense/page'
import Link from "next/link"

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
    <main style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {session.user.image && (
              <Image src={session.user.image} alt="Profile" width={48} height={48} style={{ borderRadius: '50%' }} />
            )}
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>{session.user.name}</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Personal Finance Dashboard</p>
            </div>
          </div>
          <LogoutPage />
        </header>

        {/* HERO GRID: BALANCE & ANALYTICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
            color: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
          }}>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Balance</p>
            <h1 style={{ fontSize: '3rem', margin: '12px 0', fontWeight: '800' }}>${totalBalance.toFixed(2)}</h1>
            <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', width: 'fit-content' }}>
               Active Tracking
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnalyticsChartPage data={groupedCategory} />
          </div>
        </div>

        {/* QUICK ADD SECTION */}
        <section style={{ marginBottom: '48px' }}>
          <ExpenseFormPage />
        </section>

        {/* CATEGORY FILTER NAV */}
        <nav style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['ALL', 'FOOD', 'RENT', 'ENTERTAINMENT', 'OTHER'].map((category) => {
            const isActive = (category === 'ALL' && !groupedCategory) || groupedCategory === category;
            return (
              <Link
                key={category}
                href={category === 'ALL' ? '/dashboard' : `/dashboard?category=${category}`}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  transition: 'all 0.2s ease',
                  background: isActive ? '#1e293b' : 'white',
                  color: isActive ? 'white' : '#64748b',
                  border: isActive ? '1px solid #1e293b' : '1px solid #e2e8f0',
                }}
              >
                {category}
              </Link>
            );
          })}
        </nav>

        {/* EXPENSE LIST SECTION */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>Recent Transactions</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getUserData.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No expenses found. Start by adding one above!</p>
            ) : (
              getUserData.map((expense) => (
                <div key={expense.id} style={{
                  background: 'white', padding: '16px 24px', borderRadius: '16px', border: '1px solid #e2e8f0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' 
                    }}>
                      {expense.categoryType === 'FOOD' ? '🍕' : expense.categoryType === 'RENT' ? '🏠' : '💰'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{expense.description}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{expense.categoryType}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>-${expense.amount.toFixed(2)}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <EditExpensePage id={expense.id} amount={expense.amount} description={expense.description} categoryType={expense.categoryType} />
                      <DeleteExpenseFormPage id={expense.id} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}


