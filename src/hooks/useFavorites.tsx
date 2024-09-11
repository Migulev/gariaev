import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem('gariaevFavorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gariaevFavorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  return { favorites, setFavorites, toggleFavorite }
}
