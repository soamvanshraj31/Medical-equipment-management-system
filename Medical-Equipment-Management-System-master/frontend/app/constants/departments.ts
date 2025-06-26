export const DEPARTMENTS = [
  'Biomedical Engineering',
  'Laboratory',
  'Theatre',
  'ICU',
  'Pathology',
  'Radiology',
  'Cardiology',
] as const;

export type Department = typeof DEPARTMENTS[number];

export const DEPARTMENT_COLORS = {
  'Biomedical Engineering': 'bg-blue-100 text-blue-800',
  'Laboratory': 'bg-green-100 text-green-800',
  'Theatre': 'bg-purple-100 text-purple-800',
  'ICU': 'bg-red-100 text-red-800',
  'Pathology': 'bg-yellow-100 text-yellow-800',
  'Radiology': 'bg-indigo-100 text-indigo-800',
  'Cardiology': 'bg-pink-100 text-pink-800',
} as const;

export const STATUS_COLORS = {
  active: 'bg-success-100 text-success-800',
  maintenance: 'bg-warning-100 text-warning-800',
  offline: 'bg-danger-100 text-danger-800',
} as const;

export const STATUS_ICONS = {
  active: 'CheckCircleIcon',
  maintenance: 'WrenchScrewdriverIcon',
  offline: 'XCircleIcon',
} as const; 