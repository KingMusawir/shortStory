import React from 'react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import InventoryCard from './InventoryCard'

const SelectionView = ({ selectedItems }) => {
  const { setNodeRef } = useDroppable({
    id: 'selection',
  })

  return (
    <div
      className={`h-72 bg-blue-300 rounded-md shadow-inner p-2 ${
        selectedItems.length >= 10 ? 'border-2 border-red-500' : ''
      }`}
      ref={setNodeRef}
    >
      <div className="h-full overflow-x-auto">
        <SortableContext
          items={selectedItems.map((item) => `selection-${item.id}`)}
          strategy={rectSortingStrategy}
        >
          <div className="flex gap-4 h-full">
            {selectedItems.map((item) => (
              <div key={`selection-${item.id}`} className="flex-shrink-0">
                <InventoryCard {...item} id={`selection-${item.id}`} />
              </div>
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default SelectionView
