import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'

const InventoryCard = ({ id, images }) => {
  const [showClickModal, setShowClickModal] = useState(false)
  const [showHoverModal, setShowHoverModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hoverModalPosition, setHoverModalPosition] = useState({
    top: 0,
    left: 0,
  })
  const cardRef = useRef(null)

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const displayId = id.startsWith('selection-')
    ? id.replace('selection-', '')
    : id

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    )
  }

  const updateHoverModalPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setHoverModalPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (showHoverModal) {
        updateHoverModalPosition()
      }
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [showHoverModal])

  const handleMouseEnter = () => {
    setShowHoverModal(true)
    updateHoverModalPosition()
  }

  const HoverModal = () => (
    <AnimatePresence>
      {showHoverModal && (
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
              src={images[currentImageIndex].replace('/100/100', '/300/300')}
              alt={`Item ${id}`}
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
        <img
          src={images[currentImageIndex]}
          alt={`Item ${id}`}
          className="w-full h-32 sm:h-36 md:h-40 lg:h-44 object-cover mb-1 rounded"
        />
        <p className="text-xs sm:text-sm text-gray-600 mb-1">ID: {displayId}</p>
        <div className="mt-auto flex justify-between w-full">
          <button
            onClick={prevImage}
            className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            &lt;
          </button>
          <button
            onClick={nextImage}
            className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            &gt;
          </button>
        </div>
      </div>

      {createPortal(<HoverModal />, document.body)}

      {showClickModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowClickModal(false)}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-sm sm:max-w-md md:max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex].replace('/100/100', '/300/300')}
              alt={`Item ${id}`}
              className="w-full h-auto"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={prevImage}
                className="bg-gray-200 rounded px-2 py-1 text-sm"
              >
                Previous
              </button>
              <button
                onClick={nextImage}
                className="bg-gray-200 rounded px-2 py-2 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InventoryCard
