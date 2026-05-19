const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'portfolio_students';

export const hasRemotePortfolioStore = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function createHeaders(extraHeaders = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
}

function getEndpoint(query = '') {
  const baseUrl = SUPABASE_URL.replace(/\/$/, '');
  return `${baseUrl}/rest/v1/${SUPABASE_TABLE}${query}`;
}

export async function fetchRemoteStudents() {
  if (!hasRemotePortfolioStore) {
    return null;
  }

  const response = await fetch(getEndpoint('?select=data&order=updated_at.desc'), {
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load remote portfolios: ${response.status}`);
  }

  const rows = await response.json();
  return rows.map((row) => row.data).filter(Boolean);
}

export async function saveRemoteStudent(student) {
  if (!hasRemotePortfolioStore) {
    return null;
  }

  const response = await fetch(getEndpoint(), {
    method: 'POST',
    headers: createHeaders({
      Prefer: 'resolution=merge-duplicates,return=representation',
    }),
    body: JSON.stringify([
      {
        id: student.id,
        data: student,
        updated_at: new Date().toISOString(),
      },
    ]),
  });

  if (!response.ok) {
    throw new Error(`Failed to save remote portfolio: ${response.status}`);
  }

  return response.json();
}
