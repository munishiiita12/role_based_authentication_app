'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const data = await authAPI.getMe()
      setUser(data.user)
    } catch (error) {
      // User not authenticated
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Role Auth App</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">
                    Welcome, {user.name} ({user.role})
                  </span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Role-Based Auth App
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            A modern full-stack application with role-based access control
          </p>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                href="/signup"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">🔐 Secure Authentication</h3>
            <p className="text-gray-600">
              JWT-based authentication with HTTP-only cookies for maximum security
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">👥 Role-Based Access</h3>
            <p className="text-gray-600">
              Different permissions for users and admins with role-based access control
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">📝 Item Management</h3>
            <p className="text-gray-600">
              Create, update, and delete items with search and pagination support
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
