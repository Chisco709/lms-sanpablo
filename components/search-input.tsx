"use client"

import qs from "query-string"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useAnalytics } from "@/hooks/use-analytics"

export const SearchInput = () => {
  const [value, setValue] = useState("")
  const debouncedValue = useDebounce(value)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { trackSearchQuery } = useAnalytics()

  const currentCategoryId = searchParams.get("categoryId")

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    )

    router.push(url)
    
    // Track search query if there's a search term
    if (debouncedValue && debouncedValue.trim().length > 0) {
      const category = currentCategoryId ? 'category_filtered' : 'general';
      trackSearchQuery(debouncedValue.trim(), category);
    }
  }, [debouncedValue, currentCategoryId, router, pathname, trackSearchQuery])

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="h-4 w-4 absolute top-3 left-3 text-yellow-400" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full pl-9 rounded-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
        placeholder="Buscar un curso..."
      />
    </div>
  )
} 