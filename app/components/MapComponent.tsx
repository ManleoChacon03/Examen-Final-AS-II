// app/components/MapComponent.tsx
// Este es el componente que SÓLO se carga en el cliente.

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Definición de tipos ---
interface Municipio {
  nombre: string;
  coords: LatLngExpression;
  info: string;
}

interface MapProps {
  municipios: Municipio[];
  estado: string;
}

// --- Tu ícono personalizado ---
// Arreglamos el problema del ícono de Leaflet con Webpack
const recycleIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/2048px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png',
  iconRetinaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/2048px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

// --- El Componente del Mapa ---
export default function MapComponent({ municipios, estado }: MapProps) {
  const center: LatLngExpression = [14.9722, -89.5300];

  return (
    // 'id="map"' es importante para tus estilos CSS
    <MapContainer id="map" center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Iteramos sobre los municipios usando .map() 
        para crear los Marcadores (Markers)
      */}
      {municipios.map((muni) => (
        <Marker key={muni.nombre} position={muni.coords} icon={recycleIcon}>
          <Popup>
            {/* Usamos 'dangerouslySetInnerHTML' para renderizar el HTML 
              de tu propiedad 'info' (como el <em>)
            */}
            <strong>{muni.nombre}</strong><br />
            <span dangerouslySetInnerHTML={{ __html: muni.info }} /><br /><br />
            <strong>Horario:</strong> Lunes a Viernes, 7:00am - 5:00pm<br />
            <strong>Estado:</strong> {estado}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}