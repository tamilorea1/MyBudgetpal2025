import Link from "next/link"

export default function Home() {
  return(
    <div>
      <div>
      Welcome to BudgetPal
      </div>

      <Link href="/signup">
          Create your account
      </Link>
    </div>
  )
}
