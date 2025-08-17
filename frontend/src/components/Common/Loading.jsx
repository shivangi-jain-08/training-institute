import React from 'react'

const Loading = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4 animate-fade-in">
        <div className="relative">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200`}></div>
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary-600 border-t-transparent absolute top-0 left-0`}></div>
        </div>
        <p className="text-gray-500 text-sm font-medium">{text}</p>
      </div>
    </div>
  )
}

export default Loading