import { useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { toast } from 'react-hot-toast'

export const useSelection = (
  moveItemToSelection,
  moveItemFromSelection,
  currentInventory,
) => {
  const [selectedItems, setSelectedItems] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [isDraggingOverSelection, setIsDraggingOverSelection] = useState(false)
  const [isDraggingOverInventory, setIsDraggingOverInventory] = useState(false)

  const handleDragStart = useCallback((event) => {
    const { active } = event
    setActiveId(active.id)
  }, [])

  const handleDragOver = useCallback((event) => {
    const { over } = event
    setIsDraggingOverSelection(over && over.id === 'selection')
    setIsDraggingOverInventory(over && over.id === 'inventory')
  }, [])

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event
      setActiveId(null)
      setIsDraggingOverSelection(false)
      setIsDraggingOverInventory(false)

      if (active.id !== over.id) {
        if (
          over &&
          over.id === 'selection' &&
          !active.id.startsWith('selection-')
        ) {
          // Move from inventory to selection
          if (selectedItems.length < 10) {
            const movedItem = currentInventory.find(
              (item) => item.id === active.id,
            )
            if (movedItem) {
              setSelectedItems((prev) => [
                ...prev,
                {
                  ...movedItem,
                  id: `selection-${movedItem.id}`,
                  originalId: movedItem.id,
                },
              ])
              moveItemToSelection(active.id)
            }
          } else {
            toast.error('Selection is full. Remove an item to add a new one.')
          }
        } else if (
          over &&
          (over.id === 'inventory' || over.id.startsWith('inventory-')) &&
          active.id.startsWith('selection-')
        ) {
          // Move from selection back to inventory
          const movedItemId = active.id.replace('selection-', '')
          const movedItem = selectedItems.find((item) => item.id === active.id)
          if (movedItem) {
            setSelectedItems((prev) =>
              prev.filter((item) => item.id !== active.id),
            )
            moveItemFromSelection({ ...movedItem, id: movedItemId })
          }
        } else if (
          active.id.startsWith('selection-') &&
          over &&
          over.id.startsWith('selection-')
        ) {
          // Reorder within selection
          setSelectedItems((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            return arrayMove(items, oldIndex, newIndex)
          })
        }
      }
    },
    [
      selectedItems,
      moveItemToSelection,
      moveItemFromSelection,
      currentInventory,
    ],
  )

  return {
    selectedItems,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    isDraggingOverSelection,
    isDraggingOverInventory,
    activeId,
  }
}
