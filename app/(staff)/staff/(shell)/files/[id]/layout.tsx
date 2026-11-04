import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTaxFileById, listEmployeesAction } from '@/lib/actions/files'
import { canAccessFile } from '@/lib/rbac'
import { FileTabs } from '@/components/dashboard/file-tabs'
import { TransferDrawer } from '@/components/dashboard/transfer-drawer'

export default async function FileWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const session = await getSession('staff')
  if (!session) redirect('/staff/login')
  const { id } = await params
  const row = await getTaxFileById(Number(id))
  if (!row) notFound()
  if (!canAccessFile(session, row.file)) redirect('/staff/files')
  const employees = await listEmployeesAction()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>
            {row.client.firstName} {row.client.lastName} · {row.file.fileNo}
          </h2>
          <p className="dash-muted" style={{ margin: '4px 0 0' }}>
            {row.file.stage} / {row.file.substage} · Year {row.file.year}
          </p>
        </div>
        <TransferDrawer
          fileId={row.file.id}
          employees={employees.filter((e) => e.login.toLowerCase() !== 'admin')}
          currentStage={row.file.stage}
          currentSubstage={row.file.substage}
          currentEmpId={row.file.empId}
        />
      </div>
      <FileTabs fileId={row.file.id} />
      {children}
    </div>
  )
}
