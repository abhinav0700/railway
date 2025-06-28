import { Train, Search } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: "train" | "search"
}

export function EmptyState({ title, description, icon = "search" }: EmptyStateProps) {
  const Icon = icon === "train" ? Train : Search

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  )
}
