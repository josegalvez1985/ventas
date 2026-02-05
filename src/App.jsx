import { useEffect, useState } from 'react'
import './App.css'
import Articulos from './Articulos'

// Estilos de columnas
const thLeft = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
  fontSize: '14px'
}

const thRight = {
  ...thLeft,
  textAlign: 'right'
}

const tdLeft = {
  border: '1px solid #ddd',
  padding: '8px',
  fontSize: '13px',
  textAlign: 'left'
}

const tdRight = {
  ...tdLeft,
  textAlign: 'right'
}

function App() {
  const [empresa, setEmpresa] = useState('24')
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date()
    return hoy.toISOString().split('T')[0] // YYYY-MM-DD
  })

  useEffect(() => {
    const fetchArticulos = async () => {
      setLoading(true)
      setError(null)
      try {
        // Detectar si estamos en producción (GitHub Pages) o desarrollo local
        const isProduction = window.location.hostname.includes('github.io')
        const url = isProduction
          ? 'https://oracleapex.com/ords/josegalvez/ventas/articulos'
          : '/api/articulos'
        console.log('Environment:', isProduction ? 'Production' : 'Development')
        console.log('Fetching from:', url)
        const response = await fetch(url)
        console.log('Response status:', response.status)
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
        const data = await response.json()
        console.log('Data received:', data)
        setArticulos(data.items || data || [])
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [])

  const formatearFecha = (isoFecha) => {
    const [yyyy, mm, dd] = isoFecha.split('-')
    return `${dd}/${mm}/${yyyy}`
  }

  const formatNumber = (n) => {
    return typeof n === 'number' ? n.toLocaleString('es-PY') : n
  }

  const totales = articulos.reduce(
    (acc, art) => {
      acc.total_costo += Number(art.total_costo) || 0
      acc.diferencia += Number(art.diferencia) || 0
      acc.total += Number(art.total) || 0
      acc.rentabilidad += Number(art.rentabilidad) || 0
      return acc
    },
    { total_costo: 0, diferencia: 0, total: 0, rentabilidad: 0 }
  )

  return (
    <>
      <h2>Ventas por Articulos</h2>
      {/* Vista original */}
      {/* ...existing code... */}
      <hr style={{ margin: '30px 0' }} />
      {/* Nueva vista: Articulos desde Oracle APEX */}
      <Articulos empresa={empresa} />
    </>
  )
}

export default App
