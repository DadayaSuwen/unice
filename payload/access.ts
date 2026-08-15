import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => {
  const user = req.user
  return user?.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req }) => {
  const user = req.user
  return user?.role === 'admin' || user?.role === 'editor'
}
