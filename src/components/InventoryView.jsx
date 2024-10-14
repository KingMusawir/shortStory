import React, { useCallback, useRef } from 'react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import InventoryCard from './InventoryCard'

const InventoryView = ({
  items,
  isDraggingOverInventory,
  loadMoreItems,
  isLoading,
}) => {
  const { setNodeRef } = useDroppable({
    id: 'inventory',
  })

  const observer = useRef()
  const lastCardRef = useCallback(
    (node) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && loadMoreItems) {
          loadMoreItems()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, loadMoreItems],
  )

  return (
    <div
      ref={setNodeRef}
      className={`mt-8 overflow-y-auto h-full transition-colors duration-200 p-4 ${
        isDraggingOverInventory ? 'bg-green-200' : 'bg-white'
      }`}
      style={{ maxHeight: 'calc(100vh - 380px)' }}
    >
      <h2 className="text-2xl font-bold mb-4 p-6">Inventory</h2>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-full">
          {items.map((item, index) => {
            // console.log('Rendering InventoryView  items info:', item)

            return (
              <div
                key={`inventory-${item.id}`}
                ref={index === items.length - 1 ? lastCardRef : null}
              >
                <InventoryCard
                  id={item.id}
                  originalId={item.originalId}
                  image={item.image}
                />
              </div>
            )
          })}
        </div>
      </SortableContext>
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default React.memo(InventoryView)
