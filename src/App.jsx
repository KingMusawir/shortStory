import React, { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import InventoryView from './components/InventoryView'
import SelectionView from './components/SelectionView'
import Timer from './components/Timer'
import Filter from './components/Filter'
import InventoryCard from './components/InventoryCard'

const ITEMS_PER_PAGE = 20

const App = () => {
  const [inventory, setInventory] = useState([])
  const [displayedInventory, setDisplayedInventory] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [isDraggingOverSelection, setIsDraggingOverSelection] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const generateInventory = useCallback((start, end) => {
    return Array.from({ length: end - start }, (_, index) => ({
      id: (start + index).toString(),
      images: [
        `https://picsum.photos/id/${(start + index) % 1000}/100/100`,
        `https://picsum.photos/id/${(start + index + 1) % 1000}/100/100`,
        `https://picsum.photos/id/${(start + index + 2) % 1000}/100/100`,
      ],
    }))
  }, [])

  useEffect(() => {
    const initialInventory = generateInventory(0, 1000)
    setInventory(initialInventory)
    setDisplayedInventory(initialInventory.slice(0, ITEMS_PER_PAGE))
  }, [generateInventory])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isPrime = (num) => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
      if (num % i === 0) return false
    return num > 1
  }

  const loadMoreItems = useCallback(() => {
    const filteredInventory = inventory.filter((item) => {
      const id = parseInt(item.id)
      return (
        (!filters.isEven || id % 2 === 0) &&
        (!filters.isPrime || isPrime(id)) &&
        (!filters.endsWith || item.id.endsWith(filters.endsWith)) &&
        id >= filters.range.min &&
        id <= filters.range.max
      )
    })
    const newItems = filteredInventory.slice(
      page * ITEMS_PER_PAGE,
      (page + 1) * ITEMS_PER_PAGE,
    )
    setDisplayedInventory((prev) => [...prev, ...newItems])
    setPage((prev) => prev + 1)
  }, [inventory, filters, page, isPrime])

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
  }

  const handleDragOver = (event) => {
    const { over } = event
    setIsDraggingOverSelection(
      over && (over.id === 'selection' || over.id.startsWith('selection-')),
    )
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    setIsDraggingOverSelection(false)

    if (active.id !== over.id) {
      if (
        (over.id === 'selection' || over.id.startsWith('selection-')) &&
        !active.id.startsWith('selection-')
      ) {
        // Move from inventory to selection
        if (selectedItems.length < 10) {
          const movedItem = displayedInventory.find(
            (item) => item.id === active.id,
          )
          if (movedItem) {
            setSelectedItems((prev) => [...prev, movedItem])
            setDisplayedInventory((prev) =>
              prev.filter((item) => item.id !== active.id),
            )

            if (!isTimerRunning) {
              setIsTimerRunning(true)
            }

            // Load a new item to replace the moved one
            const nextItemIndex = page * ITEMS_PER_PAGE
            if (nextItemIndex < inventory.length) {
              const nextItem = inventory[nextItemIndex]
              setDisplayedInventory((prev) => [...prev, nextItem])
              setPage((prev) => prev + 1)
            }
          }
        } else {
          // Provide feedback when selection is full
          alert('Selection is full. Remove an item to add a new one.')
        }
      } else if (
        active.id.startsWith('selection-') &&
        (over.id === 'inventory' || over.id.startsWith('inventoryItem-'))
      ) {
        // Move from selection back to inventory
        const movedItemId = active.id.replace('selection-', '')
        const movedItem = selectedItems.find((item) => item.id === movedItemId)
        if (movedItem) {
          setDisplayedInventory((prev) => [movedItem, ...prev])
          setSelectedItems((prev) =>
            prev.filter((item) => item.id !== movedItemId),
          )
        }
      } else if (
        active.id.startsWith('selection-') &&
        over.id.startsWith('selection-')
      ) {
        // Reorder within selection
        setSelectedItems((items) => {
          const oldIndex = items.findIndex(
            (item) => `selection-${item.id}` === active.id,
          )
          const newIndex = items.findIndex(
            (item) => `selection-${item.id}` === over.id,
          )
          return arrayMove(items, oldIndex, newIndex)
        })
      }
    }
  }

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters)
      const filteredInventory = inventory.filter((item) => {
        const id = parseInt(item.id)
        return (
          (!newFilters.isEven || id % 2 === 0) &&
          (!newFilters.isPrime || isPrime(id)) &&
          (!newFilters.endsWith || item.id.endsWith(newFilters.endsWith)) &&
          id >= newFilters.range.min &&
          id <= newFilters.range.max
        )
      })
      setDisplayedInventory(filteredInventory.slice(0, ITEMS_PER_PAGE))
      setPage(1)
    },
    [inventory, isPrime],
  )

  if (isSmallScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-center p-4">
          The screen you are using is too small for this application.
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <main className="flex flex-col h-screen">
        <section className="flex gap-4 bg-gray-200 h-2/3">
          <div className="w-3/4 p-4 overflow-hidden">
            <InventoryView
              items={displayedInventory}
              onLoadMore={loadMoreItems}
            />
          </div>
          <div className="w-1/4 p-4 bg-gray-100">
            <Filter onFilterChange={handleFilterChange} />
          </div>
        </section>

        <section className="flex gap-4 bg-gray-200 mt-4 h-1/3">
          <div className="w-3/4 p-4 overflow-hidden">
            <SelectionView
              selectedItems={selectedItems}
              isDraggingOverSelection={isDraggingOverSelection}
            />
          </div>
          <div className="w-1/4 p-4">
            <Timer isRunning={isTimerRunning} />
          </div>
        </section>
        <DragOverlay>
          {activeId ? (
            <InventoryCard
              {...(activeId.startsWith('selection-')
                ? selectedItems.find(
                    (item) => `selection-${item.id}` === activeId,
                  )
                : displayedInventory.find((item) => item.id === activeId))}
            />
          ) : null}
        </DragOverlay>
      </main>
    </DndContext>
  )
}

export default App
