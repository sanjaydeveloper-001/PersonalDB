import React from 'react'
import { clsx } from 'clsx'

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    )}
    <input
      ref={ref}
      className={clsx(
        'block w-full rounded-lg border bg-white dark:bg-gray-800 px-3 py-2 text-sm',
        'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100',
        'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input
