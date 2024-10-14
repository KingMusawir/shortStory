import React from 'react'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import InventoryCard from './InventoryCard'

const SelectionView = ({ selectedItems, isDraggingOverSelection }) => {
  console.log('Rendering SelectionView with items:', selectedItems)
  const { setNodeRef } = useDroppable({
    id: 'selection',
  })

  return (
    <div
      ref={setNodeRef}
      className={`h-72 rounded-md shadow-inner p-2 transition-colors duration-200 ${
        isDraggingOverSelection ? 'bg-orange-200' : 'bg-blue-300'
      } ${selectedItems.length >= 10 ? 'border-2 border-red-500' : ''}`}
    >
      <div className="h-full overflow-x-auto">
        <SortableContext
          items={selectedItems.map((item) => item.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 h-full min-w-max">
            {selectedItems.map((item) => {
              console.log('Rendering SelectionView  item info:', item)
              return (
                <div key={item.id} className="flex-shrink-0">
                  <InventoryCard
                    {...item}
                    id={item.id}
                    originalId={item.originalId}
                    image={item.image}
                  />
                </div>
              )
            })}
            {selectedItems.length < 10 && (
              <div className="flex-shrink-0 w-40 h-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                Drop here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default React.memo(SelectionView)
