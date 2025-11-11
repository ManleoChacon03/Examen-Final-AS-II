// app/clasificador/page.tsx
// ¡VERSIÓN CON LOS ESTILOS DEL MAPA!

"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// ¡CAMBIO 1: Importamos los estilos del MAPA!
import styles from '../mapa/page.module.css'; 

export default function ClasificadorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [classification, setClassification] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setClassification("");
      setError("");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, selecciona un archivo primero.");
      return;
    }

    setLoading(true);
    setClassification("");
    setError("");

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/clasificar', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error del servidor al clasificar');
      }

      const data = await res.json();
      setClassification(data.tipo);

    } catch (err) {
      console.error(err);
      setError("No se pudo clasificar la imagen. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ¡CAMBIO 2: Usamos la estructura del MAPA (header + section)!
  return (
    // Fondo de hojas (del mapa)
    <div className={styles.body}>
      
      {/* Encabezado verde oscuro (del mapa) */}
      <header className={styles.header}>
        <h1 className={styles.title}>🤖 Clasificador de Desechos (IA)</h1>
      </header>

      {/* Contenido en una 'section' con fondo blanco semitransparente */}
      <section style={{ 
        maxWidth: '700px', 
        margin: '30px auto', 
        background: 'rgba(255,255,255,0.9)', 
        borderRadius: '15px',
        padding: '20px' // Añadimos padding
      }}>
        <p className="text-center fs-5">Sube la foto de un desecho y la IA te dirá qué tipo es.</p>

        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px auto', textAlign: 'center' }}>
          <div className="mb-3">
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              onChange={handleFileChange}
              required
            />
          </div>
          
          {preview && (
            <div className="mb-3">
              <Image src={preview} alt="Vista previa" width={200} height={200} style={{ objectFit: 'cover', borderRadius: '10px' }} />
            </div>
          )}
          
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Clasificando...' : 'Clasificar Desecho'}
          </button>
        </form>

        {error && (
          <div className="alert alert-danger mt-3" style={{ maxWidth: '500px', margin: 'auto' }}>
            {error}
          </div>
        )}

        {classification && (
          <div className="alert alert-success mt-3" style={{ maxWidth: '500px', margin: 'auto' }}>
            <h4>Resultado de la IA:</h4>
            <p className="mb-0 fs-5">Esto es un desecho: <strong>{classification}</strong></p>
          </div>
        )}
      </section>

      {/* Botón 'Volver' (del mapa) */}
      <div className={styles.volver}>
        <Link href="/inicio">← Volver al inicio</Link>
      </div>
    </div>
  );
}