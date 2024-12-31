import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Header.module.css'; // Importando CSS module
//import styles from './Header.module.css'; // Importando CSS module
import { HiMenu, HiX } from 'react-icons/hi'; // Ícones do menu

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // Verifica se estamos no lado do cliente
  const [isMobile, setIsMobile] = useState(false); // Estado para controlar a largura da tela

  useEffect(() => {
    setIsClient(true); // Verifica se o código está sendo executado no cliente
    // Atualiza a largura da janela no estado
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Executa o ajuste inicial
    handleResize();
    
    // Adiciona o ouvinte de evento para mudanças no tamanho da janela
    window.addEventListener('resize', handleResize);
    
    // Limpa o ouvinte quando o componente for desmontado
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alterna o estado do menu (aberto/fechado)
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image
          src="/images/contas.png"
          alt="Logo"
          width={110}
          height={30}
        />
        <div className={styles.titleContainer}>
          <h1 className="text-2xl font-bold">
            <span className="text-red-500">Contas</span>.<span className="text-green-500">AI</span>
          </h1>
          <h2 className="text-xl font-semibold">Controle de despesa com Inteligencia Artificial</h2>
        </div>
      </div>
      
      {/* Exibe "Menu" em telas grandes e ícone de 3 linhas em telas pequenas */}
      <button
        onClick={toggleMenu}
        className={styles.menuBtn}
      >
        {isMenuOpen ? <HiX /> : (isMobile ? <HiMenu /> : 'Menu')}
      </button>
      
      {isClient && (
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}><Link href="/users/users" className={styles.navLink}>Users</Link></li>
            <li className={styles.navItem}><Link href="/documents/documents" className={styles.navLink}>Documentos</Link></li>
            <li className={styles.navItem}><Link href="/uploads/uploads" className={styles.navLink}>Uploads</Link></li>
            <li className={styles.navItem}><Link href="/photos/photos" className={styles.navLink}>Fotos_Geral</Link></li>
            <li className={styles.navItem}><Link href="/services" className={styles.navLink}>Serviços</Link></li>
            <li className={styles.navItem}><Link href="/contact" className={styles.navLink}>Contato</Link></li>
            <li className={styles.navItem}><Link href="/about" className={styles.navLink}>Abortar</Link></li>
            <li className={styles.navItem}><Link href="/" className={styles.navLink}>Home</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
