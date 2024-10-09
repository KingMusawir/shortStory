import React, { useState, useEffect } from 'react'

const Timer = ({ isRunning }) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-blue-100 p-4 rounded-md shadow-md max-w-sm">
      <h2 className="text-xl font-bold mb-2">Timer</h2>
      <p className="text-3xl font-mono">{formatTime(time)}</p>
    </div>
  )
}

export default Timer
