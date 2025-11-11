// app/mapa/page.tsx

"use client"; // ¡OBLIGATORIO!

import Link from 'next/link';
import { useMemo } from 'react';
import dynamic from 'next/dynamic'; // Importamos 'dynamic' para cargar el mapa
import styles from './page.module.css'; // Nuestros estilos
import 'leaflet/dist/leaflet.css'; // Estilos de Leaflet
import { LatLngExpression } from 'leaflet';
// Interfaz para definir el tipo de objeto
interface Municipio {
  nombre: string;
  coords: LatLngExpression; // <-- Aquí está la clave
  info: string;
}

// --- Datos y lógica de tu script original ---
const municipios: Municipio[] =[
  { nombre: "Zacapa (Cabecera)", coords: [14.9722, -89.5300], info: "Municipalidad de Zacapa. <br><em>Puntos de recolección y gestión municipal.</em>" },
  { nombre: "Teculután", coords: [14.9976, -89.6850], info: "Centro de Acopio en Km 125.5 <br><em>Carretera al Atlántico.</em>" },
  { nombre: "Río Hondo", coords: [15.0245, -89.6708], info: "Centro de recuperación en construcción." },
  { nombre: "Usumatlán", coords: [14.9640, -89.7450], info: "Actividades comunitarias para reciclaje." },
  { nombre: "La Unión", coords: [15.0305, -89.8263], info: "Puntos escolares y municipales de reciclaje." },
  { nombre: "Gualán", coords: [15.1202, -89.3633], info: "Campañas locales y reciclaje de botellas." },
  { nombre: "Cabañas", coords: [14.9333, -89.6167], info: "Educación ambiental en escuelas y limpieza." },
  { nombre: "San Jorge", coords: [14.9250, -89.4917], info: "Municipalidad trabajando contra residuos." },
  { nombre: "Huité", coords: [14.9305, -89.8735], info: "Mercados y hogares promueven reciclaje." },
  { nombre: "Estanzuela", coords: [15.0185, -89.5796], info: "Puntos de acopio comunitarios." },
  { nombre: "San Diego", coords: [14.9566, -89.8225], info: "Jornadas municipales de concientización." }
];

function estaAbierto() {
  const ahora = new Date();
  const dia = ahora.getDay();
  const hora = ahora.getHours();
  // Lunes (1) a Viernes (5) de 7am a 5pm (17)
  return dia >= 1 && dia <= 5 && hora >= 7 && hora < 17;
}

const estado = estaAbierto() ? "🟢 Abierto" : "🔴 Cerrado";
// --- Fin de la lógica original ---

export default function MapaPage() {

  // --- Carga Dinámica del Mapa ---
  // Usamos useMemo para asegurar que el componente 'Map' solo se cargue una vez.
  // 'dynamic' se encarga de que 'MapContainer' y sus hijos 
  // SÓLO se rendericen en el navegador (cliente), no en el servidor.
  const Map = useMemo(() => dynamic(
    () => import('@/app/components/MapComponent'), // Crearemos este componente
    { 
      loading: () => <p>Cargando mapa...</p>, // Mensaje mientras carga
      ssr: false // ¡Clave! Deshabilita el renderizado en servidor
    }
  ), []);

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        {/* Aplicamos la clase corregida */}
        <h1 className={styles.title}>🗺️ Mapa de Reciclaje en Municipios de Zacapa</h1>
      </header>
       <div className={styles.mapContainer}>
        {/* El componente Map (cargado dinámicamente) 
          se renderizará DENTRO de este div.
        */}
        <Map municipios={municipios} estado={estado} />
      </div>

      <div className={styles.volver}>
        <Link href="/inicio">← Volver al inicio</Link>
      </div>
    </div>
  );
}