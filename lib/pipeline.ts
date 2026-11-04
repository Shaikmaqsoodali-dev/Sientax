export type StageCode =
  | 3
  | 4
  | 5
  | 6
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 16
  | 17
  | 18
  | 19
  | 20

export type StageBucket = 'Pre Process' | 'Process' | 'Post Process'

export type SubstageDef = {
  code: StageCode
  stage: StageBucket
  substage: string
  label: string
}

export const SUBSTAGES: SubstageDef[] = [
  { code: 3, stage: 'Pre Process', substage: 'Interview Pending', label: 'Interview Pending' },
  { code: 4, stage: 'Pre Process', substage: 'Document Pending', label: 'Document Pending' },
  { code: 5, stage: 'Pre Process', substage: 'Additional Document Pending', label: 'Additional Doc Pending' },
  { code: 6, stage: 'Pre Process', substage: 'Pre Cancelled', label: 'Pre Cancelled' },
  { code: 8, stage: 'Process', substage: 'Tax Preparation Pending', label: 'Tax Preparation Pending' },
  { code: 9, stage: 'Process', substage: 'Tax Review Pending', label: 'Tax Review Pending' },
  { code: 10, stage: 'Process', substage: 'Estimates Pending', label: 'Estimates Pending' },
  { code: 11, stage: 'Process', substage: 'Payment Pending', label: 'Payment Pending' },
  { code: 12, stage: 'Process', substage: 'Process Cancelled', label: 'Process Cancelled' },
  { code: 13, stage: 'Post Process', substage: 'PDF Pending', label: 'PDF Pending' },
  { code: 14, stage: 'Post Process', substage: 'Client Confirmation Pending', label: 'Client Confirmation Pending' },
  { code: 16, stage: 'Post Process', substage: 'E-Filing Pending', label: 'E-Filing Pending' },
  { code: 17, stage: 'Post Process', substage: 'Paper Filing Pending', label: 'Paper Filing Pending' },
  { code: 18, stage: 'Post Process', substage: 'State Filing Pending', label: 'State Filing Pending' },
  { code: 19, stage: 'Post Process', substage: 'Completed', label: 'Completed' },
  { code: 20, stage: 'Post Process', substage: 'Post Process Cancelled', label: 'Post Process Cancelled' },
]

export const STAGE_GROUPS: { stage: StageBucket; codes: StageCode[] }[] = [
  { stage: 'Pre Process', codes: [3, 4, 5, 6] },
  { stage: 'Process', codes: [8, 9, 10, 11, 12] },
  { stage: 'Post Process', codes: [13, 14, 16, 17, 18, 19, 20] },
]

export function byCode(code: number): SubstageDef | undefined {
  return SUBSTAGES.find((s) => s.code === code)
}

export function bySubstage(substage: string): SubstageDef | undefined {
  return SUBSTAGES.find((s) => s.substage.toLowerCase() === substage.toLowerCase())
}

export function substagesForStage(stage: StageBucket): SubstageDef[] {
  return SUBSTAGES.filter((s) => s.stage === stage)
}

/** Prefix = last two digits of year × 10000; first file = prefix + 1 */
export function fileNoPrefix(year: number): number {
  return (year % 100) * 10000
}

export function nextFileNo(year: number, maxExisting: number | null): string {
  const prefix = fileNoPrefix(year)
  if (maxExisting == null || maxExisting < prefix) return String(prefix + 1)
  return String(maxExisting + 1)
}

export const CLIENT_STATUS_STEPS = [
  { match: ['Interview Pending'], label: 'Interview', hint: 'Complete your interview sheet' },
  { match: ['Document Pending', 'Additional Document Pending'], label: 'Documents', hint: 'Upload supporting documents' },
  { match: ['Tax Preparation Pending', 'Tax Review Pending'], label: 'Preparation', hint: 'Your return is being prepared' },
  { match: ['Estimates Pending'], label: 'Estimate', hint: 'Review and accept your estimate' },
  { match: ['Payment Pending'], label: 'Payment', hint: 'Send payment via Zelle' },
  { match: ['PDF Pending', 'Client Confirmation Pending'], label: 'Review & sign', hint: 'Review PDFs and confirm' },
  { match: ['E-Filing Pending', 'Paper Filing Pending', 'State Filing Pending'], label: 'Filing', hint: 'Return is being filed' },
  { match: ['Completed'], label: 'Completed', hint: 'Your return is complete' },
] as const

export function clientTimelineIndex(substage: string): number {
  const idx = CLIENT_STATUS_STEPS.findIndex((s) =>
    s.match.some((m) => m.toLowerCase() === substage.toLowerCase()),
  )
  return idx < 0 ? 0 : idx
}

export const DEDUCTION_DOC_TYPES = [
  'W-2',
  '1099-NEC',
  '1099-INT',
  '1099-DIV',
  '1099-B',
  '1098',
  '1095-A',
  'Passport',
  'Visa',
  'SSN Card',
  'Prior Year Return',
  'Bank Statement',
  'Donation Receipt',
  'Other',
] as const

export const REVIEW_DOC_TYPES = [
  'Federal Tax Return',
  'State Tax Return',
  'Form 8879',
  'E-file Confirmation',
  'Client Confirmation',
  'Payment Confirmation',
  'Other',
] as const
