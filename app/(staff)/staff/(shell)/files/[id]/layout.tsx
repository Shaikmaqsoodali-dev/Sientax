import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTaxFileById, listEmployeesAction } from '@/lib/actions/files'
import { canAccessFile } from '@/lib/rbac'
import { FileTabs } from '@/components/dashboard/file-tabs'
import { TransferDrawer } from '@/components/dashboard/transfer-drawer'
import { PageHeader } from '@/components/dashboard/page-header'

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
    <>
      <PageHeader
        eyebrow={`File ${row.file.fileNo} · ${row.file.year}`}
        title={`${row.client.firstName} ${row.client.lastName}`}
        description={`${row.file.stage} / ${row.file.substage}`}
        actions={
          <TransferDrawer
            fileId={row.file.id}
            employees={employees.filter((e) => e.login.toLowerCase() !== 'admin')}
            currentStage={row.file.stage}
            currentSubstage={row.file.substage}
            currentEmpId={row.file.empId}
          />
        }
      />
      <FileTabs fileId={row.file.id} />
      {children}
    </>
  )
}
