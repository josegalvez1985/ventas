// Componente para mostrar articulos desde la API Oracle APEX
import React, { useEffect, useState } from 'react';

function Articulos({ empresa = '24' }) {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fecha, setFecha] = useState('');

  // Función para formatear fecha a dd/mm/yyyy
  const formatearFecha = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchArticulos = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/articulos?p_cod_empresa=${empresa}`;
        if (fecha) {
          const fechaFormato = formatearFecha(fecha);
          url += `&p_fecha=${fechaFormato}`;
        }
        console.log('Fetching from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener los articulos');
        const data = await response.json();
        console.log('Data received:', data);
        setArticulos(data.items || []);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchArticulos();
  }, [empresa, fecha]);

  if (loading) return <div style={{ padding: '20px' }}>Cargando articulos...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  const thStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontSize: '12px',
    textAlign: 'left',
    fontWeight: 'bold'
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    fontSize: '12px'
  };

  const tdNumberStyle = {
    ...tdStyle,
    textAlign: 'right'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Articulos ({articulos.length})</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label htmlFor="fechaInput" style={{ fontWeight: 'bold' }}>Seleccionar fecha:</label>
        <input
          id="fechaInput"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr>
              <th style={thStyle}>Descripcion</th>
              <th style={thStyle}>Existencia</th>
              <th style={thStyle}>Fecha Comprobante</th>
              <th style={thStyle}>Cantidad</th>
              <th style={thStyle}>Costo Ultimo</th>
              <th style={thStyle}>Total Costo</th>
              <th style={thStyle}>Precio Lista</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>% Descuento</th>
              <th style={thStyle}>Diferencia</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Rentabilidad</th>
              <th style={thStyle}>% Rentabilidad</th>
              <th style={thStyle}>Nro Telefono</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((art, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                <td style={tdStyle}>{art.descripcion}</td>
                <td style={tdNumberStyle}>{art.existencia}</td>
                <td style={tdStyle}>{art.fec_comprobante}</td>
                <td style={tdNumberStyle}>{art.cantidad}</td>
                <td style={tdNumberStyle}>{art.costo_ultimo.toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{art.total_costo.toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{art.precio_lista.toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{art.precio.toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{art.por_descuento}%</td>
                <td style={tdNumberStyle}>{art.diferencia.toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{art.total.toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{art.rentabilidad.toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{art.rentabilidad_porc.toFixed(2)}%</td>
                <td style={tdStyle}>{art.nro_telefono || '-'}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#2c3e50', fontWeight: 'bold' }}>
              <td style={{ ...tdStyle, color: 'white', fontWeight: 'bold' }}>TOTALES</td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}></td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}>
                {articulos.reduce((sum, art) => sum + art.diferencia, 0).toLocaleString('es-ES')}
              </td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}>
                {articulos.reduce((sum, art) => sum + art.total, 0).toLocaleString('es-ES')}
              </td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}>
                {articulos.reduce((sum, art) => sum + art.rentabilidad, 0).toLocaleString('es-ES')}
              </td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}>
              </td>
              <td style={{ ...tdStyle, color: 'white', fontWeight: 'bold' }}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Articulos;
