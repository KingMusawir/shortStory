import React from 'react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import InventoryCard from './InventoryCard'

const SelectionView = ({ selectedItems }) => {
  const { setNodeRef } = useDroppable({
    id: 'selection',
  })

  return (
    <div className="" style={{ height: '25vh' }}>
      <div ref={setNodeRef}>
        <SortableContext
          items={selectedItems.map((item) => `selection-${item.id}`)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
