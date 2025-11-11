// app/page.tsx
"use client"; // Necesario para el useEffect del audio

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./page.module.css"; // Importamos los estilos de esta página

export default function WelcomePage() {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Replicamos tu 'onload' para intentar reproducir el audio
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          // Los navegadores modernos bloquean el autoplay con sonido.
          // Si quieres que suene, el usuario debe interactuar primero.
          // Lo dejaremos intentar, pero puede fallar (lo cual es normal).
          await audioRef.current.play();
        } catch (error) {
          console.warn("Autoplay de audio bloqueado por el navegador.", error);
        }
      }
    };
    
    const timer = setTimeout(playAudio, 100);
    
    return () => clearTimeout(timer); // Limpieza
  }, []);

  return (
    // Usamos 'styles.body' para aplicar el fondo de pantalla
    <div className={styles.body}>
      
      {/* Usamos 'styles.overlay' */}
      <div className={styles.overlay}>
        <h1>🌍 Bienvenido a Zacapa Limpia</h1>
        <p>Descubre cómo cuidar tu entorno aprendiendo a gestionar los desechos.</p>
        
        {/* Usamos Link para ir a la página principal */}
        <Link href="/inicio" className={styles.link}>
          Entrar al sitio
        </Link>
      </div>

      <audio ref={audioRef} id="audio" loop>
        <source
          src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_49a7bc5b17.mp3"
          type="audio/mpeg"
        />
        Tu navegador no soporta audio.
      </audio>
    </div>
  );
}