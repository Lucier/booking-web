import { useState } from 'react'
import { User, Mail, Shield, Trash2 } from 'lucide-react'
import { usersApi } from '@/api/users'
import { useApi } from '@/hooks/useApi'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/contexts/ToastContext'
import { getApiErrorMessage } from '@/utils/errors'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatDateTime } from '@/utils/dates'

export function UsersPage() {
  const { user: me } = useAuthStore()
  const toast = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { data: users, loading, error, refetch } = useApi(() => usersApi.list())

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await usersApi.delete(deleteId)
      toast.success('Usuário removido')
      setDeleteId(null)
      refetch()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao remover usuário'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && users?.length === 0 && (
        <EmptyState icon={User} title="Nenhum usuário encontrado" />
      )}

      {!loading && !error && (users?.length ?? 0) > 0 && (
        <>
          <p className="text-sm text-gray-500">{users!.length} usuário(s) cadastrado(s)</p>
          <div className="flex flex-col gap-3">
            {users!.map((u) => (
              <Card key={u.id}>
                <Card.Body className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-semibold text-base shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                      <Badge variant={u.role === 'ADMIN' ? 'admin' : 'default'}>
                        {u.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                      </Badge>
                      {u.id === me?.id && <Badge variant="info">Você</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {u.email}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        Desde {formatDateTime(u.created_at)}
                      </span>
                    </div>
                  </div>

                  {me?.role === 'ADMIN' && u.id !== me.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => setDeleteId(u.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                    >
                      Remover
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remover usuário"
        description="Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        loading={deleting}
      />
    </div>
  )
}
