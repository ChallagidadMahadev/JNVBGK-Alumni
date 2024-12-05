export const HOUSE_COLORS = {
  'ARAVALI': '59, 130, 246',   // blue-500
  'NILGIRI': '34, 197, 94',    // green-500
  'SHIVALIK': '239, 68, 68',   // red-500
  'UDAYAGIRI': '234, 179, 8'   // yellow-500
} as const;

export const OCCUPATIONS = [
  'Engineering',
  'Medicine',
  'Teaching',
  'Business',
  'Government Service',
  'Armed Forces',
  'Law',
  'Arts & Entertainment',
  'Agriculture',
  'Research & Academia',
  'Others'
] as const;

export const OCCUPATION_SUBFIELDS = {
  'Engineering': [
    'Software Development',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics',
    'Chemical Engineering',
    'Others'
  ],
  'Medicine': [
    'General Medicine',
    'Surgery',
    'Pediatrics',
    'Cardiology',
    'Neurology',
    'Dentistry',
    'Others'
  ],
  'Teaching': [
    'Primary Education',
    'Secondary Education',
    'Higher Education',
    'Special Education',
    'Others'
  ],
  'Business': [
    'Entrepreneurship',
    'Management',
    'Finance',
    'Marketing',
    'Others'
  ],
  'Government Service': [
    'Civil Services',
    'State Services',
    'Public Sector',
    'Others'
  ],
  'Armed Forces': [
    'Army',
    'Navy',
    'Air Force',
    'Others'
  ],
  'Law': [
    'Corporate Law',
    'Criminal Law',
    'Civil Law',
    'Others'
  ],
  'Arts & Entertainment': [
    'Music',
    'Dance',
    'Acting',
    'Visual Arts',
    'Others'
  ],
  'Agriculture': [
    'Farming',
    'Agribusiness',
    'Agricultural Research',
    'Others'
  ],
  'Research & Academia': [
    'Scientific Research',
    'Social Sciences',
    'Humanities',
    'Others'
  ]
} as const;

export const PARTICIPATION_CATEGORIES = [
  'Education',
  'Sports',
  'Music',
  'Dance',
  'Drama',
  'Debate',
  'Science & Technology',
  'Social Service',
  'Others'
] as const;

export const OCCUPATION_PREFIXES = {
  'Engineering': 'Er.',
  'Medicine': 'Dr.',
  'Teaching': 'Prof.',
  'Law': 'Adv.',
  'Research & Academia': 'Dr.',
  'Armed Forces': 'Off.',
  'Business': 'Mr./Ms.',
  'Government Service': 'Mr./Ms.',
  'Arts & Entertainment': 'Mr./Ms.',
  'Agriculture': 'Mr./Ms.',
  'Others': 'Mr./Ms.'
} as const;
