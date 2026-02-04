import { useEffect, useState } from 'react'
import './App.css'

function App() {
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
        const fechaAPI = formatearFecha(fecha) // convierte a DD/MM/YYYY
        const response = await fetch(`https://apex.oracle.com/pls/apex/josegalvez/ventas/articulos?P_EMPRESA=24&P_FECHA=${fechaAPI}`)
        if (!response.ok) throw new Error('Error al obtener los art�culos')
        const data = await response.json()
        setArticulos(data.items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [fecha])

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
      <label>
        Fecha:{' '}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </label>

      {loading && <p>Cargando artículos...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={thLeft}>Descripción</th>
                <th style={thRight}>Stock</th>
                <th style={thLeft}>Fecha</th>
                <th style={thRight}>Cantidad</th>
                <th style={thRight}>Costo</th>
                <th style={thRight}>Total Costo</th>
                <th style={thRight}>Precio Lista</th>
                <th style={thRight}>Precio</th>
                <th style={thRight}>% Desc.</th>
                <th style={thRight}>Descuento</th>
                <th style={thRight}>Total</th>
                <th style={thRight}>Rentabilidad</th>
                <th style={thRight}>% Rent.</th>
                <th style={thLeft}>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((art, index) => (
                <tr key={index}>
                  <td style={tdLeft}>{art.descripcion}</td>
                  <td style={tdRight}>{formatNumber(art.existencia)}</td>
                  <td style={tdLeft}>{art.fec_comprobante}</td>
                  <td style={tdRight}>{formatNumber(art.cantidad)}</td>
                  <td style={tdRight}>{formatNumber(art.costo_ultimo)}</td>
                  <td style={tdRight}>{formatNumber(art.total_costo)}</td>
                  <td style={tdRight}>{formatNumber(art.precio_lista)}</td>
                  <td style={tdRight}>{formatNumber(art.precio)}</td>
                  <td style={tdRight}>{formatNumber(art.por_descuento)}</td>
                  <td style={tdRight}>{formatNumber(art.diferencia)}</td>
                  <td style={tdRight}>{formatNumber(art.total)}</td>
                  <td style={tdRight}>{formatNumber(art.rentabilidad)}</td>
                  <td style={tdRight}>{formatNumber(art.rentabilidad_porc)}</td>
                  <td style={tdLeft}>{art.nro_telefono}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={tdLeft} colSpan={5}><strong>TOTALES</strong></td>
                <td style={tdRight}><strong>{formatNumber(totales.total_costo)}</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={tdRight}><strong>{formatNumber(totales.diferencia)}</strong></td>
                <td style={tdRight}><strong>{formatNumber(totales.total)}</strong></td>
                <td style={tdRight}><strong>{formatNumber(totales.rentabilidad)}</strong></td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </>
  )
}

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

export default App
