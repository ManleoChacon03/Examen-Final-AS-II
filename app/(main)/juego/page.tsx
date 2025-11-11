// app/juego/page.tsx

"use client"; // ¡OBLIGATORIO! Es una página 100% interactiva.

import { useState, useEffect, useRef, DragEvent, MouseEvent } from 'react';
import Link from 'next/link';
import styles from './page.module.css'; // Importamos nuestros estilos CSS

// --- Definición de tipos para TypeScript ---
interface ObjetoDesecho {
  id: string;
  texto: string;
  tipo: "organicos" | "reciclables" | "noreciclables";
}

// --- Datos del juego (de tu script original) ---
const objetos: ObjetoDesecho[] = [
  { id: "manzana", texto: "🍎 Cáscara de manzana", tipo: "organicos" },
  { id: "botella", texto: "🥤 Botella plástica", tipo: "reciclables" },
  { id: "pañal", texto: "🍼 Pañal desechable", tipo: "noreciclables" },
  { id: "hojas", texto: "🍂 Hojas secas", tipo: "organicos" },
  { id: "carton", texto: "📦 Caja de cartón", tipo: "reciclables" },
  { id: "papelhigienico", texto: "🧻 Papel higiénico usado", tipo: "noreciclables" },
  { id: "banana", texto: "🍌 Cáscara de plátano", tipo: "organicos" },
  { id: "lata", texto: "🥫 Lata de soda", tipo: "reciclables" },
  { id: "cepillo", texto: "🪥 Cepillo de dientes viejo", tipo: "noreciclables" }
];

// Mapa de respuestas correctas
const respuestasCorrectas: { [key: string]: string } = Object.fromEntries(
  objetos.map(obj => [obj.id, obj.tipo])
);

export default function JuegoPage() {
  
  // --- ESTADO de React ---
  
  // 1. Los objetos a mostrar en este juego (tu variable 'seleccionados')
  // Usamos useState con una función inicial para que el 'random' 
  // se ejecute solo una vez cuando el componente carga.
  const [objetosJuego, setObjetosJuego] = useState<ObjetoDesecho[]>(() => {
    const cantidad = Math.floor(Math.random() * 4) + 4;
    return objetos.sort(() => 0.5 - Math.random()).slice(0, cantidad);
  });

  // 2. Los objetos que ya han sido clasificados (para moverlos del área de juego)
  const [clasificados, setClasificados] = useState<string[]>([]);
  
  // 3. El objeto seleccionado (para modo móvil/táctil)
  const [desechoSeleccionado, setDesechoSeleccionado] = useState<string | null>(null);

  // 4. Referencias a los contenedores para aplicar efectos (CSS)
  const organicosRef = useRef<HTMLDivElement>(null);
  const reciclablesRef = useRef<HTMLDivElement>(null);
  const noreciclablesRef = useRef<HTMLDivElement>(null);
  const refs = {
    organicos: organicosRef,
    reciclables: reciclablesRef,
    noreciclables: noreciclablesRef
  };

  // --- MANEJADORES DE EVENTOS (Drag & Drop) ---

  // Tu función 'drag'
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  // Tu función 'allowDrop'
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Tu función 'drop'
  const handleDrop = (e: DragEvent<HTMLDivElement>, tipoContenedor: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    verificarResultado(tipoContenedor, id);
  };

  // --- MANEJADORES DE EVENTOS (Click/Táctil) ---

  // 1. Al hacer clic en un desecho
  const handleClickDesecho = (id: string) => {
    // Si ya está clasificado, no hacemos nada
    if (clasificados.includes(id)) return;
    setDesechoSeleccionado(id === desechoSeleccionado ? null : id); // Permite seleccionar/deseleccionar
  };

  // 2. Al hacer clic en un contenedor
  const handleClickContenedor = (tipoContenedor: string) => {
    if (desechoSeleccionado) {
      verificarResultado(tipoContenedor, desechoSeleccionado);
      setDesechoSeleccionado(null); // Limpiamos la selección
    }
  };

  // --- LÓGICA DEL JUEGO ---

  // Tu función 'efectoContenedor'
  const efectoContenedor = (tipoContenedor: string, esCorrecto: boolean) => {
    const ref = refs[tipoContenedor as keyof typeof refs];
    if (!ref.current) return;
    
    const clase = esCorrecto ? styles.correcto : styles.incorrecto;
    ref.current.classList.add(clase);
    setTimeout(() => {
      ref.current?.classList.remove(clase);
    }, 1000);
  };

  // Tu función 'verificarResultado'
  const verificarResultado = async (tipoContenedor: string, idDesecho: string) => {
    if (clasificados.includes(idDesecho)) return; // Ya fue clasificado

    if (respuestasCorrectas[idDesecho] === tipoContenedor) {
      // ¡Correcto!
      efectoContenedor(tipoContenedor, true);
      
      // Actualizamos el estado para mover el objeto al contenedor
      const nuevosClasificados = [...clasificados, idDesecho];
      setClasificados(nuevosClasificados);

      // Revisar si ya ganó (lo hacemos asíncrono para que React actualice el estado)
      setTimeout(async () => {
        if (nuevosClasificados.length === objetosJuego.length) {
          // ¡Ganó! Importamos Swal dinámicamente
          const Swal = (await import('sweetalert2')).default;
          Swal.fire({
            icon: 'success',
            title: '¡Excelente trabajo!',
            text: 'Clasificaste todos los desechos correctamente 🎉',
            confirmButtonColor: '#1b4332',
            confirmButtonText: '¡Jugar otra vez!'
          }).then(() => {
            // Recargamos el estado del juego, no toda la página
            setClasificados([]); // Resetea clasificados
            // Genera nuevos objetos
            const cantidad = Math.floor(Math.random() * 4) + 4;
            setObjetosJuego(objetos.sort(() => 0.5 - Math.random()).slice(0, cantidad));
          });
        }
      }, 300); // Pequeño delay

    } else {
      // ¡Incorrecto!
      efectoContenedor(tipoContenedor, false);
    }
  };

  // --- RENDERIZADO (JSX) ---

  // Separamos los objetos que están en el juego vs. los ya clasificados
  const objetosEnJuego = objetosJuego.filter(obj => !clasificados.includes(obj.id));
  
  // Creamos un mapa de objetos clasificados por tipo
  const objetosClasificados: { [key: string]: ObjetoDesecho[] } = {
    organicos: objetosJuego.filter(obj => clasificados.includes(obj.id) && obj.tipo === 'organicos'),
    reciclables: objetosJuego.filter(obj => clasificados.includes(obj.id) && obj.tipo === 'reciclables'),
    noreciclables: objetosJuego.filter(obj => clasificados.includes(obj.id) && obj.tipo === 'noreciclables')
  };

  return (
    // Usamos las clases del CSS Module
    <div className={styles.body}> 
      <div className={styles.overlay}>
<h2 className={styles.title}>🧩 Juego: Clasifica los Desechos</h2>        <p className="text-center">¡Arrastra el desecho al contenedor correcto!</p>
        <p className="text-center">O haz clic en el desecho y luego en el contenedor.</p>

        {/* Contenedores */}
        <div className="row text-center mb-4 px-2">
          
          {/* Contenedor Orgánicos */}
          <div className="col-12 col-md-4 mb-3">
            <h5>🍃 Orgánicos</h5>
            <div 
              id="organicos" 
              ref={organicosRef}
              className={styles.contenedor}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'organicos')}
              onClick={() => handleClickContenedor('organicos')}
            >
              {/* Renderiza los objetos ya clasificados aquí */}
              {objetosClasificados.organicos.map(obj => (
                <div key={obj.id} className={styles.desecho}>
                  {obj.texto}
                </div>
              ))}
            </div>
          </div>

          {/* Contenedor Reciclables */}
          <div className="col-12 col-md-4 mb-3">
            <h5>♻️ Reciclables</h5>
            <div 
              id="reciclables" 
              ref={reciclablesRef}
              className={styles.contenedor}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'reciclables')}
              onClick={() => handleClickContenedor('reciclables')}
            >
              {objetosClasificados.reciclables.map(obj => (
                <div key={obj.id} className={styles.desecho}>
                  {obj.texto}
                </div>
              ))}
            </div>
          </div>

          {/* Contenedor No Reciclables */}
          <div className="col-12 col-md-4 mb-3">
            <h5>🗑️ No reciclables</h5>
            <div 
              id="noreciclables" 
              ref={noreciclablesRef}
              className={styles.contenedor}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'noreciclables')}
              onClick={() => handleClickContenedor('noreciclables')}
            >
              {objetosClasificados.noreciclables.map(obj => (
                <div key={obj.id} className={styles.desecho}>
                  {obj.texto}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zona de Juego (Desechos por clasificar) */}
        <div className={styles.zonaJuego} id="zona-juego">
          {objetosEnJuego.map(obj => (
            <div 
              key={obj.id} 
              id={obj.id} 
              className={`${styles.desecho} ${desechoSeleccionado === obj.id ? styles.seleccionado : ''}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, obj.id)}
              onClick={() => handleClickDesecho(obj.id)}
            >
              {obj.texto}
            </div>
          ))}
        </div>

        {/* Botón Volver */}
        <div className={styles.volver}>
          <Link href="/inicio">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}