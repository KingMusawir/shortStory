import React, { useState, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'

const InventoryCard = ({ id, originalId, image }) => {
  const [showClickModal, setShowClickModal] = useState(false)
  const [showHoverModal, setShowHoverModal] = useState(false)
  const [hoverModalPosition, setHoverModalPosition] = useState({
    top: 0,
    left: 0,
  })
  const cardRef = useRef(null)
  const fallbackImage = 'https://picsum.photos/100/100?random=' + id

  // console.log('Rendering InventoryCard:', { id, originalId, image })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, transition, isDragging],
  )

  const displayId = id.startsWith('selection-') ? originalId : id

  const updateHoverModalPosition = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setHoverModalPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    setShowHoverModal(true)
    updateHoverModalPosition()
  }, [updateHoverModalPosition])

  const HoverModal = () => (
    <AnimatePresence>
      {showHoverModal && image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: `${hoverModalPosition.top}px`,
            left: `${hoverModalPosition.left}px`,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={image.replace('/100/100', '/300/300')}
              alt={`Item ${displayId}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div
        ref={(node) => {
          setNodeRef(node)
          cardRef.current = node
        }}
        style={style}
        {...attributes}
        {...listeners}
        className="border border-gray-300 p-2 m-1 w-full sm:w-40 md:w-48 lg:w-56 h-48 sm:h-52 md:h-56 lg:h-60 text-center cursor-move bg-white shadow-sm rounded-md relative flex flex-col"
        onClick={() => setShowClickModal(true)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowHoverModal(false)}
      >
        {image ? (
          <div className="relative w-full h-32 sm:h-36 md:h-40 lg:h-44 mb-1">
            <img
              src={image}
              alt={`Item ${displayId}`}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = fallbackImage
              }}
            />
          </div>
        ) : (
          <div className="w-full h-32 sm:h-36 md:h-40 lg:h-44 bg-gray-200 flex items-center justify-center mb-1 rounded">
            No image
          </div>
        )}
        <p className="text-xs sm:text-sm text-gray-600 mb-1">
          ID: {displayId || 'N/A'}
        </p>
      </div>

      {createPortal(<HoverModal />, document.body)}

      {showClickModal && image && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowClickModal(false)}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-sm sm:max-w-md md:max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.replace('/100/100', '/300/300')}
              alt={`Item ${displayId}`}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default React.memo(InventoryCard)
