import { useState, useCallback, useEffect, useMemo } from 'react'
import { fetchMultipleItems } from '../utils/api.js'
import { applyFilters } from '../utils/filters.js'
import { arrayMove } from '@dnd-kit/sortable'
import { toast } from 'react-hot-toast'

export const useInventory = (initialBatchSize = 20) => {
  const [inventory, setInventory] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    isEven: false,
    isPrime: false,
    endsWith: '',
    range: { min: 0, max: 100000 },
  })
  const [activeId, setActiveId] = useState(null)
  const [isDraggingOverSelection, setIsDraggingOverSelection] = useState(false)
  const [isDraggingOverInventory, setIsDraggingOverInventory] = useState(false)

  const loadMoreItems = useCallback(
    async (count = 20) => {
      if (isLoading) return
      setIsLoading(true)
      try {
        const newItems = await fetchMultipleItems(count)
        setInventory((prevItems) => [
          ...prevItems,
          ...newItems.map((item) => ({
            ...item,
            id: item.id,
            originalId: item.id,
          })),
        ])
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  useEffect(() => {
    if (inventory.length === 0) {
      loadMoreItems(initialBatchSize)
    }
  }, [])

  const filteredInventory = useMemo(() => {
    return applyFilters(inventory, filters)
  }, [inventory, filters])

  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }))
  }, [])

  const moveItemToSelection = useCallback((itemId) => {
    setInventory((prevInventory) => {
      const index = prevInventory.findIndex((item) => item.id === itemId)
      if (index !== -1) {
        const newInventory = [...prevInventory]
        const [removedItem] = newInventory.splice(index, 1)
        setSelectedItems((prevSelected) => [
          ...prevSelected,
          {
            ...removedItem,
            id: `selection-${removedItem.id}`,
            originalId: removedItem.id,
          },
        ])
        return newInventory
      }
      return prevInventory
    })
  }, [])

  const moveItemFromSelection = useCallback((item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((selectedItem) => selectedItem.id !== item.id),
    )
    setInventory((prevInventory) => [
      ...prevInventory,
      {
        ...item,
        id: item.originalId,
        originalId: item.originalId,
      },
    ])
  }, [])

  const handleDragStart = useCallback((event) => {
    console.log('Drag started:', event)
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

      if (!active || !over) return

      if (over.id === 'selection') {
        if (!active.id.startsWith('selection-')) {
          if (selectedItems.length < 10) {
            moveItemToSelection(active.id)
          } else {
            toast.error('Selection is full. Remove an item to add a new one.')
          }
        }
      } else if (
        over.id === 'inventory' &&
        active.id.startsWith('selection-')
      ) {
        const movedItem = selectedItems.find((item) => item.id === active.id)
        if (movedItem) {
          moveItemFromSelection(movedItem)
        }
      } else if (
        active.id.startsWith('selection-') &&
        over.id.startsWith('selection-')
      ) {
        setSelectedItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id)
          const newIndex = items.findIndex((item) => item.id === over.id)
          return arrayMove(items, oldIndex, newIndex)
        })
      }

      setActiveId(null)
      setIsDraggingOverSelection(false)
      setIsDraggingOverInventory(false)
    },
    [selectedItems, moveItemToSelection, moveItemFromSelection],
  )

  return {
    inventory: filteredInventory,
    selectedItems,
    isLoading,
    loadMoreItems,
    updateFilters,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    isDraggingOverSelection,
    isDraggingOverInventory,
    activeId,
  }
}
