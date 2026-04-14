import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function RequireAdmin() {
  const { admin, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-admin-bg" aria-busy="true" aria-label="Loading admin panel">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <p className="text-sm text-cocoa/50 font-body">Loading...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
