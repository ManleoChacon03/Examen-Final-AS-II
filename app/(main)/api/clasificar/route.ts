// app/api/clasificar/route.ts
// ¡VERSIÓN FINAL CON AUTENTICACIÓN CORREGIDA (API KEY + API SECRET)!

import { NextResponse } from 'next/server';

// --- CONFIGURACIÓN DE IMAGGA ---
// ¡Sacado de tu captura 'image_f61103.png'!
const IMAGGA_API_KEY = process.env.IMAGGA_API_KEY;
const IMAGGA_API_SECRET = process.env.IMAGGA_API_SECRET;

const API_URL = 'https://api.imagga.com/v2/tags';

/**
 * Lógica para "traducir" las etiquetas
 * (¡CON PALABRAS EN INGLÉS!)
 */
function traducirLabels(labels: string[]): string {
  
  // 1. Prioridad: No Reciclables
  if (labels.some(l => 
    l.includes('diaper') ||              // pañal
    l.includes('toilet paper') ||       // papel higiénico
    l.includes('tissue') ||             // pañuelo
    l.includes('sanitary napkin') ||    // toalla sanitaria
    l.includes('plastic wrap') ||       // envoltura de plastico
    l.includes('toothbrush')            // cepillo de dientes
  )) {
    return "No Reciclable";
  }

  // 2. Reciclables
  if (labels.some(l => 
    l.includes('plastic bottle') ||     // botella de plastico
    l.includes('bottle') ||             // botella
    l.includes('glass bottle') ||       // botella de vidrio
    l.includes('can') ||                // lata
    l.includes('soda can') ||           // lata de soda
    l.includes('cardboard') ||          // cartón
    l.includes('box') ||                // caja
    l.includes('paper')                 // papel
  )) {
    return "Reciclable";
  }

  // 3. Orgánicos
  if (labels.some(l => 
    l.includes('food') ||               // comida
    l.includes('fruit') ||              // fruta
    l.includes('peel') ||               // cascara (ej. banana peel)
    l.includes('vegetable') ||          // vegetal
    l.includes('leaf') ||               // hoja (para tus dos fotos de hoja)
    l.includes('leaves')                // hojas
  )) {
    return "Orgánico";
  }

  // 4. Si no coincide con nada
  return "Desconocido (No se pudo clasificar)";
}


// --- EL MANEJADOR DE LA API (POST) ---
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió imagen' }, { status: 400 });
    }

    const imaggaFormData = new FormData();
    imaggaFormData.append('image', file);

    // ¡¡¡AQUÍ ESTÁ LA CORRECCIÓN!!!
    // ¡Se usa API_KEY + ':' + API_SECRET!
    const basicAuth = Buffer.from(IMAGGA_API_KEY + ':' + IMAGGA_API_SECRET).toString('base64');

    // 3. Enviar a Imagga usando fetch
    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}` // Usamos la variable corregida
      },
      body: imaggaFormData 
    });

    // ¡Manejo de errores a prueba de balas!
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Error de la API de Imagga (fetch):", errorText);
      
      let errorDetail = errorText;
      try {
        const errorData = JSON.parse(errorText);
        errorDetail = errorData.status?.text || errorText;
      } catch (e) {
        // No era JSON
      }
      
      throw new Error(`Error de la API de Imagga: ${errorDetail}`);
    }

    const response = await apiResponse.json();

    // 4. Procesar la respuesta
    const tags = response.result?.tags ?? [];
    const descriptions = tags.map((t: any) => t.tag.en.toLowerCase()) ?? [];
    
    console.log("Labels de Imagga:", descriptions); // ¡¡¡ESTO AHORA DEBE MOSTRAR PALABRAS!!!

    const tipoDesecho = traducirLabels(descriptions);

    return NextResponse.json({ tipo: tipoDesecho });

  } catch (error: any) {
    console.error('Error en Imagga API:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor de IA' }, { status: 500 });
  }
}