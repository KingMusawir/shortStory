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
    <div className="m-4 bg-gray-50 p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isEven}
              onChange={(e) => handleFilterChange('isEven', e.target.checked)}
              className="mr-2"
            />
            Is Even
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isPrime}
              onChange={(e) => handleFilterChange('isPrime', e.target.checked)}
              className="mr-2"
            />
            Is Prime
          </label>
        </div>
        <div>
          <label className="block mb-2">Ends With</label>
          <input
            type="text"
            value={filters.endsWith}
            onChange={(e) => handleFilterChange('endsWith', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Range</label>
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
              className="w-1/2 p-2 border rounded"
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
              className="w-1/2 p-2 border rounded"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filter
