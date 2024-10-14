import React from 'react'
import { DragOverlay } from '@dnd-kit/core'
import InventoryCard from './InventoryCard'

const DragOverlayContent = ({ activeId, inventory, selectedItems }) => {
  console.log('DragOverlayContent rendered:', {
    activeId,
    inventory,
    selectedItems,
  })
  const findItem = (id) => {
    if (id.startsWith('selection-')) {
      return selectedItems.find((item) => item.id === id)
    } else {
      return inventory.find((item) => item.id === id)
    }
  }

  const activeItem = activeId ? findItem(activeId) : null

  return (
    <DragOverlay>
      {activeItem ? (
        <InventoryCard
          id={activeItem.id}
          originalId={activeItem.originalId}
          image={activeItem.image}
        />
      ) : null}
    </DragOverlay>
  )
}

export default DragOverlayContent
