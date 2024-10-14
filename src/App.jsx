import React, { useCallback } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  pointerWithin,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Toaster } from 'react-hot-toast'

import { useInventory } from './hooks/useInventory.js'
import InventoryView from './components/InventoryView.jsx'
import Filter from './components/Filter.jsx'
import SelectionView from './components/SelectionView.jsx'
import Timer from './components/Timer.jsx'
import DragOverlayContent from './components/DragOverlayContent.jsx'
import { useScreenSize } from './hooks/useScreenSize.js'

const AppContent = () => {
  const {
    inventory,
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
  } = useInventory()

  const { isSmallScreen } = useScreenSize()

  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   }),
  // )

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })
  const sensors = useSensors(mouseSensor, touchSensor)

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
    <>
      <Toaster />
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="flex flex-col h-screen">
          <section className="flex gap-4 bg-gray-200 h-2/3">
            <div className="w-3/4 p-4 overflow-hidden">
              <InventoryView
                items={inventory}
                isLoading={isLoading}
                loadMoreItems={loadMoreItems}
                isDraggingOverInventory={isDraggingOverInventory}
              />
            </div>
            <div className="w-1/4 p-4 bg-gray-100">
              <Filter onFilterChange={updateFilters} />
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
              <Timer isRunning={selectedItems.length > 0} />
            </div>
          </section>
          <DragOverlayContent
            activeId={activeId}
            inventory={inventory}
            selectedItems={selectedItems}
          />
        </main>
      </DndContext>
    </>
  )
}

const App = () => <AppContent />

export default App
