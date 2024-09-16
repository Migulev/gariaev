import { Matrix } from '@/types'
import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Matrix['id'][]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const saveFavorites = (newFavorites: Matrix['id'][]) => {
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }

  const toggleFavorite = (id: Matrix['id']) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id]
    saveFavorites(newFavorites)
  }

  return { favorites, toggleFavorite, setFavorites: saveFavorites }
}
