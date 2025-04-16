import { SearchX } from "lucide-react"

interface EmptyStateProps {
  filter: string
}

export function EmptyState({ filter }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No emails found</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        {filter === "All Emails"
          ? "Your inbox is empty. Check back later for new messages."
          : `No emails with the "${filter}" mood were found.`}
      </p>
    </div>
  )
}
