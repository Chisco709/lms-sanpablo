import { redirect } from "next/navigation"

export default function NotFound() {
  redirect("/dashboard")
  return null
}
