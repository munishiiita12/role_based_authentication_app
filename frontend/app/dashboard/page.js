'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI, itemsAPI } from '@/lib/api'
import { z } from 'zod'

const itemSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional().default(''),
  status: z.enum(['todo', 'in-progress', 'done']).optional().default('todo'),
})

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo' })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchItems()
    }
  }, [user, pagination.page, searchTerm])

  const checkAuth = async () => {
    try {
      const data = await authAPI.getMe()
      setUser(data.user)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      const data = await itemsAPI.getItems({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
      })
      setItems(data.items)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page on search
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ title: '', description: '', status: 'todo' })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      status: item.status,
    })
    setFormErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({ title: '', description: '', status: 'todo' })
    setFormErrors({})
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})

    // Validate form
    try {
      itemSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setFormErrors(fieldErrors)
        return
      }
    }

    setSubmitting(true)

    try {
      if (editingItem) {
        await itemsAPI.updateItem(editingItem._id, formData)
      } else {
        await itemsAPI.createItem(formData)
      }
      closeModal()
      fetchItems()
    } catch (error) {
      console.error('Failed to save item:', error)
      alert(error.message || 'Failed to save item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      await itemsAPI.deleteItem(id)
      fetchItems()
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert(error.message || 'Failed to delete item')
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Role Auth App
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {user?.role === 'admin'
              ? 'You are an admin. You can see and manage all items.'
              : 'Manage your items below. You can only see and edit your own items.'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
            >
              + Create Item
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No items found matching your search.' : 'No items yet. Create your first item!'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {user?.role === 'admin' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {item.description || <span className="italic text-gray-400">No description</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        {user?.role === 'admin' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.owner?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{item.owner?.email}</div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.pages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.pages} ({pagination.total} total items)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? 'Edit Item' : 'Create New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Item title"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Item description (optional)"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
