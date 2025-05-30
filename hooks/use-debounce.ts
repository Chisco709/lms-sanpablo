import { useEffect, useState, useRef } from "react"

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Limpiar timer anterior si existe
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Establecer nuevo timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || 500)

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, delay])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return debouncedValue
} 