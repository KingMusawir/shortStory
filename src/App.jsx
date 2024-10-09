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

// Number of items to display per page
const ITEMS_PER_PAGE = 20

const App = () => {
  // State variables
  const [inventory, setInventory] = useState([]) // Full inventory
  const [displayedInventory, setDisplayedInventory] = useState([]) // Currently displayed inventory items
  const [selectedItems, setSelectedItems] = useState([]) // Selected items
  const [isTimerRunning, setIsTimerRunning] = useState(false) // Timer state
  const [filters, setFilters] = useState({}) // Applied filters
  const [page, setPage] = useState(1) // Current page number
  const [isSmallScreen, setIsSmallScreen] = useState(false) // Screen size state
  const [activeId, setActiveId] = useState(null) // ID of the currently dragged item

  // Set up drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Generate inventory items with random images
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

  // Initialize inventory on component mount
  useEffect(() => {
    const initialInventory = generateInventory(0, 1000)
    setInventory(initialInventory)
    setDisplayedInventory(initialInventory.slice(0, ITEMS_PER_PAGE))
  }, [generateInventory])

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Check if a number is prime
  const isPrime = (num) => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
      if (num % i === 0) return false
    return num > 1
  }

  // Load more items when scrolling
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

  // Get the next item from the inventory
  const getNextItem = useCallback(() => {
    const nextItemIndex = page * ITEMS_PER_PAGE
    if (nextItemIndex < inventory.length) {
      return inventory[nextItemIndex]
    }
    return null
  }, [inventory, page])

  // Handle the start of a drag operation
  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
  }

  // Handle the end of a drag operation
  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (active.id !== over.id) {
      if (over.id === 'selection' && selectedItems.length < 10) {
        // Move from inventory to selection
        const movedItemIndex = displayedInventory.findIndex(
          (item) => item.id === active.id,
        )
        if (movedItemIndex !== -1) {
          const movedItem = displayedInventory[movedItemIndex]
          setSelectedItems((prevItems) => [...prevItems, movedItem])

          // Get the next item from inventory
          const nextItemIndex = page * ITEMS_PER_PAGE
          const nextItem =
            nextItemIndex < inventory.length ? inventory[nextItemIndex] : null

          setDisplayedInventory((prevItems) => {
            const newItems = prevItems.filter((item) => item.id !== active.id)
            if (nextItem) {
              newItems.push(nextItem)
            }
            return newItems
          })

          if (!isTimerRunning) {
            setIsTimerRunning(true)
          }

          // Increment the page if we've added a new item
          if (nextItem) {
            setPage((prevPage) => prevPage + 1)
          }
        }
      } else if (
        active.id.startsWith('selection-') &&
        over.id === 'inventory'
      ) {
        // Move from selection back to inventory
        const movedItemIndex = selectedItems.findIndex(
          (item) => `selection-${item.id}` === active.id,
        )
        if (movedItemIndex !== -1) {
          const movedItem = selectedItems[movedItemIndex]
          setDisplayedInventory((prevItems) => [
            movedItem,
            ...prevItems.slice(0, -1),
          ])
          setSelectedItems((prevItems) =>
            prevItems.filter((item) => `selection-${item.id}` !== active.id),
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

  // Handle filter changes
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

  // Render a message for small screens
  if (isSmallScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-center p-4">
          The screen you are using is too small for this application.
        </p>
      </div>
    )
  }

  // Main render
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="flex flex-col h-screen">
        <section className="flex gap-4 bg-gray-200">
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
        <section className="grid grid-cols-[1fr_16rem] gap-4 p-4 bg-gray-200 mt-4 items-center justify-center">
          <SelectionView selectedItems={selectedItems} />
          <Timer isRunning={isTimerRunning} />
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
