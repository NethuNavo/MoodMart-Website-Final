const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getProducts() {
  const res = await fetch(`${API}/api/products`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}
