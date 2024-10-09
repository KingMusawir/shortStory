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
        className="border border-gray-300 p-2 m-1 w-full sm:w-40 md:w-48 lg:w-56 h-48 sm:h-52 md:h-56 lg:h-60 text-center cursor-move bg-white shadow-sm rounded-md relative flex flex-col"
        onClick={() => setShowModal(true)}
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

      {/* Modal for larger image view */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
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
                className="bg-gray-200 rounded px-2 py-1 text-sm"
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
