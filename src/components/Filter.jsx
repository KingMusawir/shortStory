import React, { useState } from 'react'

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    isEven: false,
    isPrime: false,
    endsWith: '',
    range: { min: 0, max: 100000 },
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-gray-50 p-2 sm:p-4 rounded-md shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Filters</h2>
      <div className="space-y-2 sm:space-y-4">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isEven}
              onChange={(e) => handleFilterChange('isEven', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm sm:text-base">Is Even</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isPrime}
              onChange={(e) => handleFilterChange('isPrime', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm sm:text-base">Is Prime</span>
          </label>
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
            Ends With
          </label>
          <input
            type="text"
            value={filters.endsWith}
            onChange={(e) => handleFilterChange('endsWith', e.target.value)}
            className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
            Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={filters.range.min}
              onChange={(e) =>
                handleFilterChange('range', {
                  ...filters.range,
                  min: Number(e.target.value),
                })
              }
              className="w-1/2 p-1 sm:p-2 border rounded text-sm sm:text-base"
              placeholder="Min"
            />
            <input
              type="number"
              value={filters.range.max}
              onChange={(e) =>
                handleFilterChange('range', {
                  ...filters.range,
                  max: Number(e.target.value),
                })
              }
              className="w-1/2 p-1 sm:p-2 border rounded text-sm sm:text-base"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filter
