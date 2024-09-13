import { useEffect, useState } from 'react'

interface PersistOptions<T> {
  converter?: (value: string) => T
}

export function usePersist<T = string>(
  key: string,
  initialValue: T,
  options?: PersistOptions<T>,
) {
  const [value, setValue] = useState<T>(() => {
    const savedValue = localStorage.getItem(key)
    if (savedValue !== null) {
      if (options?.converter) {
        return options.converter(savedValue)
      }
      return (
        typeof initialValue === 'string' ? savedValue : JSON.parse(savedValue)
      ) as T
    }
    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    )
  }, [key, value])

  return [value, setValue] as const
}
