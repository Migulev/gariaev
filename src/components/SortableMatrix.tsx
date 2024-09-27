import { Matrix } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { useState, useEffect } from 'react'

interface SortableItemProps {
  id: Matrix['id']
  children: React.ReactNode
}

export function SortableMatrix({ id, children }: SortableItemProps) {
  const [supportsHover, setSupportsHover] = useState(false)

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches
    setSupportsHover(hasHover)
  }, [])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative' as const,
    touchAction: 'none',
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} className="cursor-auto">
      <div
        {...listeners}
        className={`absolute h-full w-6 cursor-grab rounded-l-xl ${
          supportsHover ? 'hover:bg-muted' : ''
        }`}
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ⋮⋮
      </div>
      {children}
    </div>
  )
}
