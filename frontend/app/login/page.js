'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    setErrors({})

    // Validate form
    try {
      loginSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
        return
      }
    }

    setLoading(true)

    try {
      await authAPI.login(formData)
      router.push('/dashboard')
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {apiError && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {apiError}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
