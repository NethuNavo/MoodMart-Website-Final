import React, { useEffect, useState } from 'react'
import { getProducts } from './api'

export default function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error)
  }, [])

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>MERN Shop</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {products.map(p => (
          <div key={p._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
            <img src={p.image || 'https://via.placeholder.com/200'} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <strong>${p.price}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
