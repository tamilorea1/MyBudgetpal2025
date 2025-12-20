import { logout } from "@/lib/actions"

export default function LogoutPage() {
  return (
    <div>
      <form action={logout}>
            <button
            type="submit"
            >
                Logout of your account
            </button>
      </form>
    </div>
  )
}
