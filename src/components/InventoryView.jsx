import React, { useCallback, useRef } from 'react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import InventoryCard from './InventoryCard'

const InventoryView = ({ items, onLoadMore }) => {
  const observer = useRef()
  const lastCardRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore()
        }
      })
      if (node) observer.current.observe(node)
    },
    [onLoadMore],
  )

  const { setNodeRef } = useDroppable({
    id: 'inventory',
  })

  return (
    <div
      ref={setNodeRef}
      className="mt-8 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 380px)' }}
    >
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={index === items.length - 1 ? lastCardRef : null}
            >
              <InventoryCard {...item} />
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default InventoryView
