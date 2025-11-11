// app/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import "@/app/globals.css"; // ← Agrega esta línea


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Manejar el scroll suave a las secciones
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    // Cerrar el menú en móvil
    setIsOpen(false);
    
    // Si estamos en /inicio, hacer scroll directo
    if (pathname === '/inicio') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Si estamos en otra página, navegar a /inicio y luego hacer scroll
      window.location.href = `/inicio#${targetId}`;
    }
  };

  // Manejar el scroll cuando se carga la página con un hash
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/inicio" onClick={() => setIsOpen(false)}>
          🌱 Zacapa Limpia
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#inicio" onClick={(e) => handleScrollClick(e, 'inicio')}>
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#tipos" onClick={(e) => handleScrollClick(e, 'tipos')}>
                Tipos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#consejos" onClick={(e) => handleScrollClick(e, 'consejos')}>
                Consejos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#tren-aseo" onClick={(e) => handleScrollClick(e, 'tren-aseo')}>
                Tren de Aseo
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contacto" onClick={(e) => handleScrollClick(e, 'contacto')}>
                Contáctanos
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/juego" onClick={() => setIsOpen(false)}>
                Juego
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/mapa" onClick={() => setIsOpen(false)}>
                Mapa
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/clasificador" onClick={() => setIsOpen(false)}>
                Clasificar (IA)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}