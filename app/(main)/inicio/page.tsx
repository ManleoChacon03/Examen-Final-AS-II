// app/inicio/page.tsx
// VERSIÓN COMPLETA Y FUNCIONAL (con lógica de animación)

"use client"; 

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

// --- Definición de tipos ---
interface RecorridoItem {
  dia: string;
  lugar: string;
  cuota: number;
}

// --- Datos ---
const datosTren: { [key: string]: string[] } = {
  "Teculután": ["Barrio el centro", "Colonia Milagro 1 y 2", "Aldea el Arco", "Caserio Vega del coban", "El oreganal y vecinos"],
  "Estanzuela": ["Barrio el centro", "Aldea San Nicolás", "Aldea Tres Pinos", "Aldea El Guayabal", "Aldea Chispan"],
  "Zacapa": ["Barrio el centro", "Cruz de mayo", "La Fragua", "El Maguey", "Los Achiotes"],
  "Gualán": ["Barrio el centro", "Arenal", "Cacao", "Barbasco", "El Chile"],
  "Cabañas": ["Barrio el centro", "Aldea Los Planes", "Lajitas", "Potreritos", "El Palmar"],
  "San Jorge": ["Barrio el centro", "Mal País", "Llano de Piedras", "Santa Rosalia", "Casco urbano"],
  "Usumatlán": ["Barrio el centro", "Huijo", "La Palmilla", "El Jute", "Pueblo Nuevo"],
  "Rio Hondo": ["Barrio el centro", "El Rosario y la Pepesca", "Santa Cruz, Monte grande y Ojo de agua", "Llano Largo y Llano Verde", "Casas de pinto, sunzapote y nuevo sunzapote"],
  "Huite": ["Barrio el centro", "Oscurana", "Las Joyas", "Agua Caliente", "El Amatillo"],
  "La Union": ["Barrio el centro", "Agua Fria", "Joconal y La laguna", "Cari y Corozal", "Lampocoy y Pacayalito"],
  "San Diego": ["Barrio el centro", "El porvenir", "Venecia y Santa Elena", "Santa Elena y el Terrero", "Pampur y Hierva Buena"]
};

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function InicioPage() {

  // --- ESTADO ---
  const [selectedMuni, setSelectedMuni] = useState<string>("");
  const [recorrido, setRecorrido] = useState<RecorridoItem[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  
  // --- ¡SOLUCIÓN DE ANIMACIÓN! ---
  // 1. Creamos un estado 'isMounted'
  const [isMounted, setIsMounted] = useState(false);

  // 2. Usamos useEffect para cambiar el estado SÓLO en el navegador
  useEffect(() => {
    setIsMounted(true); // Esto activa las animaciones
    
    // Tu lógica de EmailJS también va aquí
    const initEmailJS = async () => {
      try {
        const emailjs = (await import('@emailjs/browser')).default;
        emailjs.init('bb2sT5VdGuCoUskC9'); 
      } catch (error) {
        console.error("Error al inicializar EmailJS:", error);
      }
    };
    initEmailJS();
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // --- MANEJADORES DE EVENTOS ---
const handleContactoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (!formRef.current) return; 

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.sendForm('service_r5a91s7', 'template_ad86zdj', formRef.current);

      // --- Éxito (LÓGICA RESTAURADA) ---
      const alerta = document.createElement('div');
      // Esta es la parte que "troné" y ahora está restaurada
      alerta.innerHTML = `
        <div id="custom-alert" style="
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          background-color: #d1e7dd; color: #0f5132; padding: 15px 25px;
          border: 1px solid #badbcc; border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 9999; text-align: center;
        ">
          <strong>✅ ¡Mensaje enviado!</strong><br>Gracias por contactarnos.
          <br><button id="cerrar-alerta" style="
            margin-top: 10px; background-color: #0f5132; color: white;
            border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;
          ">OK</button>
        </div>
      `;
      document.body.appendChild(alerta);

const cerrarAlertaBtn = alerta.querySelector('#cerrar-alerta');      
cerrarAlertaBtn?.addEventListener('click', () => {
        alerta.remove();
      });

      formRef.current?.reset(); 

    } catch (error) {
      // --- Error (Lógica de Swal) ---
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al enviar tu mensaje.',
        confirmButtonColor: '#d33'
      });
      console.log(error);
    }
  };
  const handleMuniChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const municipio = e.target.value;
    setSelectedMuni(municipio); 
    const lugares = datosTren[municipio];
    const nuevoRecorrido = lugares.map((lugar, i) => ({
      dia: dias[i],
      lugar: lugar,
      cuota: Math.floor(Math.random() * 6) + 5 
    }));
    setRecorrido(nuevoRecorrido); 
  };

 const handleDescargarPDF = async () => { 
  if (recorrido.length === 0 || !selectedMuni) return;
  
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf'); 
    
    // Creamos un div temporal con el mismo estilo que tenías
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.width = "800px";
    tempDiv.style.background = "white";
    tempDiv.style.padding = "20px";

    // Título del PDF
    const h4 = document.createElement("h4");
    h4.style.textAlign = "center";
    h4.textContent = `Recorrido del Tren de Aseo – ${selectedMuni}`;
    tempDiv.appendChild(h4);

    // Creamos la tabla
    const table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("cellPadding", "8");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    // Encabezado de la tabla
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr style="background-color: #d1e7dd; text-align: center;">
        <th>Día</th><th>Lugar</th><th>Cuota</th>
      </tr>`;
    table.appendChild(thead);

    // Cuerpo de la tabla
    const tbody = document.createElement("tbody");
    tbody.style.textAlign = "center";
    recorrido.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${item.dia}</td><td>${item.lugar}</td><td>Q${item.cuota}</td>`;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tempDiv.appendChild(table);

    // Pie de página
    const p = document.createElement("p");
    p.style.textAlign = "right";
    p.innerHTML = "<em>Municipalidad de Zacapa – Programa de Limpieza</em>";
    tempDiv.appendChild(p);

    // Añadimos el div temporal al body
    document.body.appendChild(tempDiv);

    // Convertimos a canvas
    const canvas = await html2canvas(tempDiv);
    const imgData = canvas.toDataURL("image/png");
    
    // Creamos el PDF
    const pdf = new jsPDF({ 
      orientation: "portrait", 
      unit: "pt", 
      format: "letter" 
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = pageWidth / canvas.width;
    const imgHeight = canvas.height * ratio;

    // Cargamos el logo
    const logo = new window.Image() as HTMLImageElement;
    logo.src = "https://upload.wikimedia.org/wikipedia/commons/6/69/Coat_of_arms_of_Zacapa.png";

    logo.onload = function () {
      // Añadimos el logo
      pdf.addImage(logo, "PNG", 50, 40, 60, 60);
      // Añadimos la tabla
      pdf.addImage(imgData, "PNG", 0, 100, pageWidth, imgHeight);
      // Descargamos el PDF
      pdf.save(`Tren_de_Aseo_${selectedMuni}.pdf`);
      // Removemos el div temporal
      document.body.removeChild(tempDiv);

      // Mensaje de éxito
      const alerta = document.createElement('div');
      alerta.innerHTML = `
        <div style="
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          background-color: #d1e7dd; color: #0f5132; padding: 15px 25px;
          border: 1px solid #badbcc; border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 9999; text-align: center;
        ">
          <strong>✅ PDF descargado exitosamente</strong>
          <br><button onclick="this.parentElement.remove()" style="
            margin-top: 10px; background-color: #0f5132; color: white;
            border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;
          ">OK</button>
        </div>
      `;
      document.body.appendChild(alerta);
      setTimeout(() => alerta.remove(), 3000);
    };

    // Manejo de error al cargar el logo
    logo.onerror = function () {
      // Si falla el logo, generamos el PDF sin él
      pdf.addImage(imgData, "PNG", 0, 60, pageWidth, imgHeight);
      pdf.save(`Tren_de_Aseo_${selectedMuni}.pdf`);
      document.body.removeChild(tempDiv);
      
      const alerta = document.createElement('div');
      alerta.innerHTML = `
        <div style="
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          background-color: #d1e7dd; color: #0f5132; padding: 15px 25px;
          border: 1px solid #badbcc; border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 9999; text-align: center;
        ">
          <strong>✅ PDF descargado exitosamente</strong>
          <br><button onclick="this.parentElement.remove()" style="
            margin-top: 10px; background-color: #0f5132; color: white;
            border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;
          ">OK</button>
        </div>
      `;
      document.body.appendChild(alerta);
      setTimeout(() => alerta.remove(), 3000);
    };
    
  } catch (error) {
    console.error("Error al generar PDF:", error);
    const Swal = (await import('sweetalert2')).default;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo generar el PDF. Intenta nuevamente.',
      confirmButtonColor: '#d33'
    });
  }
};
  // --- RENDERIZADO (JSX) ---
  return (
    <>
      {/* 3. Aplicamos la clase '.visible' condicionalmente */}
      <section id="inicio" className={`text-center bg-light fade-in ${isMounted ? 'visible' : ''}`}>
        <div className="container">
          <h1 className="display-4">Gestión de Desechos</h1>
          <p className="lead">Conoce cómo reducir, clasificar y gestionar correctamente los residuos en Zacapa, Guatemala.</p>
          <Image 
            src="https://icones.pro/wp-content/uploads/2022/05/icone-de-fleches-de-recyclage-vert.png" 
            width={80} 
            height={80} 
            alt="Gestión" 
            className="mt-3" 
            priority // Le añadimos 'priority' (o loading="eager") como sugería la advertencia
          />
        </div>
      </section>

      <section id="tipos" className={`bg-white fade-in ${isMounted ? 'visible' : ''}`}>
        <div className="container">
          {/* ... (tu contenido de Tipos de Desechos) ... */}
          <h2 className="mb-4 text-center">Tipos de Desechos</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <i className="fas fa-apple-alt fa-3x text-success mb-2"></i>
              <h4>Orgánicos</h4>
              <p>Restos de comida, cáscaras, hojas… todo lo que puede descomponerse naturalmente.</p>
            </div>
            <div className="col-md-4 mb-4">
              <i className="fas fa-recycle fa-3x text-primary mb-2"></i>
              <h4>Reciclables</h4>
              <p>Papel, cartón, botellas, vidrio y latas. Pueden volver a usarse si los separas.</p>
            </div>
            <div className="col-md-4 mb-4">
              <i className="fas fa-trash-alt fa-3x text-danger mb-2"></i>
              <h4>No reciclables</h4>
              <p>Desechos sanitarios, pañales, papel sucio. No se pueden recuperar.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="consejos" className={`bg-light fade-in ${isMounted ? 'visible' : ''}`}>
        <div className="container">
          {/* ... (tu contenido de Consejos) ... */}
          <h2 className="text-center mb-4">Consejos para una Zacapa más limpia</h2>
          <div className="row align-items-center">
            <div className="col-md-6">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">♻️ Reutiliza envases y bolsas.</li>
                <li className="list-group-item">🗑️ Separa la basura desde tu casa.</li>
                <li className="list-group-item">🌿 Haz compost con restos de comida.</li>
                <li className="list-group-item">🤝 Apoya campañas de limpieza en tu comunidad.</li>
              </ul>
            </div>
            <div className="col-md-6 text-center">
              <Image 
                src="https://productoscolcar.com/wp-content/uploads/2023/01/Ecologia-hotmelt-1024x576.png" 
                width={120} 
                height={68} 
                alt="Tips Icon" 
              />
            </div>
          </div>
        </div>
      </section>

     {/* Sección: Tren de Aseo Municipal (INTERACTIVA) */}
      <section id="tren-aseo" className={`p-5 bg-white fade-in ${isMounted ? 'visible' : ''}`}>
        <div className="container">
          <h2 className="text-center mb-4">🚛 Tren de Aseo Municipal</h2>
          <p className="text-center mb-4">Selecciona tu municipio para ver el recorrido semanal y la cuota por servicio:</p>

          {/* Selector de municipio (CONTROLADO POR REACT) */}
          <div className="mb-4 text-center">
            <select 
              id="municipio-select" 
              className="form-select mx-auto" 
              style={{ maxWidth: '400px' }}
              value={selectedMuni} 
              onChange={handleMuniChange} 
            >
              <option value="" disabled>Selecciona un municipio</option>
              {Object.keys(datosTren).map(muni => (
                <option key={muni} value={muni}>{muni}</option>
              ))}
            </select>
          </div>

          {/* Contenedor de la tabla (RENDERIZADO CONDICIONAL) */}
          {/* ¡¡¡AQUÍ ESTABA EL ERROR!!! */}
          {recorrido.length > 0 && (
            <div id="recorrido-container" className="table-responsive animated-table">
              <div className="text-center mb-3">
                <h4 id="titulo-pdf">Recorrido del Tren de Aseo – {selectedMuni}</h4>
              </div>
              <table className="table table-bordered table-striped">
                <thead className="table-success text-center">
                  <tr>
                    <th>🗓️ Día</th>
                    <th>📍 Lugar</th>
                    <th>💰 Cuota</th>
                  </tr>
                </thead>
                <tbody id="tabla-recorrido" className="text-center">
                  {recorrido.map(item => (
                    <tr key={item.dia}>
                      <td>{item.dia}</td>
                      <td>{item.lugar}</td>
                      <td>Q{item.cuota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-end"><em>Municipalidad de Zacapa – Programa de Limpieza</em></p>
            </div>
          )}
          {/* FIN DEL CÓDIGO RESTAURADO */}

          {/* Botón de PDF (RENDERIZADO CONDICIONAL) */}
          {recorrido.length > 0 && (
            <div className="text-center mt-3">
              <button 
                id="descargar-pdf" 
                className="btn btn-outline-success"
                onClick={handleDescargarPDF} 
              >
                <i className="fas fa-file-pdf me-2"></i>Descargar recorrido en PDF
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="contacto" className={`p-5 bg-light fade-in ${isMounted ? 'visible' : ''}`}>
        <div className="container">
          <h2 className="text-center mb-4">Contáctanos</h2>
          <p className="text-center">¿Tienes dudas, sugerencias o quieres reportar un basurero ilegal? Escríbenos:</p>
          <form 
            id="formulario-contacto" 
            className="mx-auto" // quitamos 'fade-in' de aquí
            style={{ maxWidth: '600px' }}
            ref={formRef} 
            onSubmit={handleContactoSubmit} 
          >
            {/* ... (tus inputs de formulario) ... */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Tu nombre</label>
              <input type="text" className="form-control" id="name" name="name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Tu correo</label>
              <input type="email" className="form-control" id="email" name="email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Mensaje</label>
              <textarea className="form-control" id="message" name="message" rows={4} required></textarea>
            </div>
            <button type="submit" className="btn btn-success w-100">Enviar mensaje</button>
          </form>
        </div>
      </section>
    </>
  );
}