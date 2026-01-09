# 💰 MyBudgetPal 2025

A modern, full-stack personal finance tracker built to help users manage expenses and monitor their budgets in real-time. This application features a secure authentication system and a seamless integration between a Next.js frontend and a PostgreSQL database.

**🔗 [Live Demo](https://my-budgetpal2025.vercel.app)** ---

## ✨ Features

- **User Authentication:** Secure email/password login and session management powered by NextAuth.js.
- **Expense Management:** Add, view, and track personal expenses with ease.
- **Real-time Database:** Powered by Supabase (PostgreSQL) for reliable data storage and retrieval.
- **Responsive Design:** A clean, mobile-friendly interface built with Next.js and CSS.
- **Dockerized Development:** Fully containerized local environment for consistent development across different machines.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Authentication:** [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Database:** [PostgreSQL via Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Infrastructure:** [Docker](https://www.docker.com/) & [Vercel](https://vercel.com/)
- **Styling:** CSS

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Docker Desktop (for local database)
- A Supabase Project (for production database)

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/tamilorea1/MyBudgetpal2025.git]
   cd MyBudgetpal2025/mybudgetpal2025
2. **Set up Environment Variables:**
   - Create a .env file in the root directory and add the following:
        **DATABASE_URL**="postgresql://myuser:mypassword@localhost:5432/budgetpal_db?schema=public"
        **AUTH_SECRET**="your_random_secret_here"
        **AUTH_TRUST_HOST**=true
3. **Run with Docker**
     docker-compose up -d

4. **Initialize the Database**
     npx prisma generate
     npx prisma db push

5. **Start the Development Server**
     npm run dev

**Deployment**
- This project is optimized for deployment on Vercel.

**License**
Distributed under the MIT License. See LICENSE for more information.
