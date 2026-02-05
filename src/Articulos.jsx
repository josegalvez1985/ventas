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
        // Detectar si estamos en producción (GitHub Pages) o desarrollo local
        const isProduction = window.location.hostname.includes('github.io');
        const baseUrl = isProduction
          ? 'https://oracleapex.com/ords/josegalvez/ventas/articulos'
          : '/api/articulos';
        
        console.log('Environment:', isProduction ? 'Production' : 'Development');
        console.log('Base URL:', baseUrl);
        
        let url = `${baseUrl}?P_COD_EMPRESA=${empresa}`;
        if (fecha) {
          const fechaFormato = formatearFecha(fecha);
          url += `&P_FECHA=${encodeURIComponent(fechaFormato)}`;
          console.log('Fecha seleccionada:', fecha);
          console.log('Fecha formato API (dd/mm/yyyy):', fechaFormato);
        } else {
          console.log('Sin filtro de fecha - mostrando todos los registros');
        }
        console.log('URL completa:', url);
        console.log('Parametro P_COD_EMPRESA:', empresa);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Error al obtener los articulos');
        const data = await response.json();
        console.log('Data received:', data);
        console.log('Cantidad de items:', data.items ? data.items.length : 0);
        setArticulos(data.items || []);
      } catch (err) {
        console.error('Error en fetch:', err);
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
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    zIndex: 10
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    fontSize: '12px',
    whiteSpace: 'nowrap'
  };

  const tdNumberStyle = {
    ...tdStyle,
    textAlign: 'right'
  };

  const containerStyle = {
    padding: '10px',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  };

  const tableContainerStyle = {
    flex: 1,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch'
  };

  const filterContainerStyle = {
    marginBottom: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
    flexShrink: 0
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ 
        fontSize: 'clamp(18px, 5vw, 24px)', 
        marginBottom: '15px',
        flexShrink: 0
      }}>
        Articulos ({articulos.length})
      </h2>
      <div style={filterContainerStyle}>
        <label htmlFor="fechaInput" style={{ fontWeight: 'bold', fontSize: '14px' }}>
          Seleccionar fecha:
        </label>
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
      <div style={tableContainerStyle}>
        <table style={{ 
          width: '100%', 
          minWidth: '800px',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          fontSize: 'clamp(10px, 2vw, 12px)'
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
                <td style={tdNumberStyle}>{Number(art.existencia).toLocaleString('es-ES')}</td>
                <td style={tdStyle}>{art.fec_comprobante}</td>
                <td style={tdNumberStyle}>{Number(art.cantidad).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Math.round(art.costo_ultimo).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Math.round(art.total_costo).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Math.round(art.precio_lista).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Math.round(art.precio).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Number(art.por_descuento).toLocaleString('es-ES')}%</td>
                <td style={tdNumberStyle}>{Math.round(art.diferencia).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Math.round(art.total).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Math.round(art.rentabilidad).toLocaleString('es-ES')}</td>
                <td style={tdNumberStyle}>{Number(art.rentabilidad_porc).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}%</td>
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
                {Math.round(articulos.reduce((sum, art) => sum + art.diferencia, 0)).toLocaleString('es-ES')}
              </td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}>
                {Math.round(articulos.reduce((sum, art) => sum + art.total, 0)).toLocaleString('es-ES')}
              </td>
              <td style={{ ...tdNumberStyle, color: 'white', fontWeight: 'bold' }}>
                {Math.round(articulos.reduce((sum, art) => sum + art.rentabilidad, 0)).toLocaleString('es-ES')}
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
