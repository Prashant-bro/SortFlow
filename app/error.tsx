"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We encountered an error while processing your request. Please try again or contact support if the issue
          persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => reset()} className="flex-1">
            Try again
          </Button>
          <Button variant="outline" onClick={() => router.push("/login")} className="flex-1">
            Go to login
          </Button>
        </div>
      </div>
    </div>
  )
}
