import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { locationsApi } from '@/api/locations'
import { useApi } from '@/hooks/useApi'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/contexts/ToastContext'
import { createLocationSchema } from '@/schemas/location.schema'
import type { CreateLocationFormData } from '@/schemas/location.schema'
import { getApiErrorMessage } from '@/utils/errors'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { formatDateTime } from '@/utils/dates'

export function LocationsPage() {
  const { user } = useAuthStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { data: locations, loading, error, refetch } = useApi(() => locationsApi.list())

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLocationFormData>({
    resolver: zodResolver(createLocationSchema),
  })

  const onCreateSubmit = async (data: CreateLocationFormData) => {
    try {
      await locationsApi.create(data.name)
      toast.success('Auditório criado com sucesso!')
      setCreateOpen(false)
      reset()
      refetch()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao criar auditório'))
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await locationsApi.delete(deleteId)
      toast.success('Auditório removido')
      setDeleteId(null)
      refetch()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao remover auditório'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {locations?.length ?? 0} auditório(s) cadastrado(s)
        </p>
        {user && (
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
            Novo Auditório
          </Button>
        )}
      </div>

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

      {!loading && !error && locations?.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="Nenhum auditório cadastrado"
          description="Adicione um novo auditório para começar a realizar agendamentos."
          action={
            user ? (
              <Button onClick={() => setCreateOpen(true)} icon={<Plus className="h-4 w-4" />}>
                Novo Auditório
              </Button>
            ) : undefined
          }
        />
      )}

      {!loading && !error && (locations?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {locations!.map((location) => (
            <Card key={location.id} hoverable onClick={() => navigate(`/locations/${location.id}`)}>
              <Card.Body>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 shrink-0">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Criado em {formatDateTime(location.created_at)}
                      </p>
                    </div>
                  </div>
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(location.id)
                      }}
                      className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); reset() }}
        title="Novo Auditório"
        size="sm"
      >
        <form onSubmit={handleSubmit(onCreateSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome do auditório"
            placeholder="Ex: Auditório Principal"
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" type="button" onClick={() => { setCreateOpen(false); reset() }}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Criar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remover auditório"
        description="Tem certeza que deseja remover este auditório? Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        loading={deleting}
      />
    </div>
  )
}
