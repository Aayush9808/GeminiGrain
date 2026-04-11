import { redirect } from 'next/navigation'

// Old onboarding flow — replaced by /login + /register
export default function AuthPage() {
  redirect('/login')
}
