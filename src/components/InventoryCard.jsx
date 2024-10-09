import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const InventoryCard = ({ id, images }) => {
  // State for modal visibility and current image index
  const [showModal, setShowModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Set up sortable functionality
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  // Apply transform and transition styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Remove 'selection-' prefix from ID if present
  const displayId = id.startsWith('selection-')
    ? id.replace('selection-', '')
    : id

  // Function to show next image
  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Function to show previous image
  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    )
  }

  return (
    <>
      {/* Main card component */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="border border-gray-300 p-4 m-2 w-60 h-60 text-center cursor-move bg-white shadow-sm rounded-md relative"
        onClick={() => setShowModal(true)}
      >
        <img
          src={images[currentImageIndex]}
          alt={`Item ${id}`}
          className="w-full h-40 object-cover mb-2 rounded"
        />
        <p className="text-sm text-gray-600">ID: {displayId}</p>
        <div className="absolute bottom-1 left-1 right-1 flex justify-between">
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

      {/* Modal for larger image view */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex].replace('/100/100', '/300/300')}
              alt={`Item ${id}`}
              className="max-w-full max-h-full"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={prevImage}
                className="bg-gray-200 rounded px-4 py-2"
              >
                Previous
              </button>
              <button
                onClick={nextImage}
                className="bg-gray-200 rounded px-4 py-2"
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
