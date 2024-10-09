import React from 'react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import InventoryCard from './InventoryCard'

const SelectionView = ({ selectedItems }) => {
  const { setNodeRef } = useDroppable({
    id: 'selection',
  })

  return (
    <div className="flex flex-col h-full" ref={setNodeRef}>
      <div className="flex-grow overflow-y-auto bg-white rounded-md shadow-inner p-2">
        <SortableContext
          items={selectedItems.map((item) => `selection-${item.id}`)}
          strategy={rectSortingStrategy}
        >
          {/*<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6  gap-12 md:gap-4">*/}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 min-h-full">
            {selectedItems.map((item) => (
              <InventoryCard
                key={`selection-${item.id}`}
                {...item}
                id={`selection-${item.id}`}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default SelectionView
