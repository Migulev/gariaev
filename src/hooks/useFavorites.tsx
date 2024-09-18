import { Matrix } from '@/types'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
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

  const handleDragEndFavorites = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = favorites.indexOf(active.id as Matrix['id'])
      const newIndex = favorites.indexOf(over?.id as Matrix['id'])
      setFavorites(arrayMove(favorites, oldIndex, newIndex))
    }
  }

  return {
    favorites,
    toggleFavorite,
    handleDragEndFavorites,
  }
}
