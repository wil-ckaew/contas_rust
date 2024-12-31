// pages/index.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/index.module.css'; // Novo arquivo CSS

const HomePage = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/desp.gif"
            alt="Contas AI Logo"
            width={200}
            height={200}
          />
        </div>
        <h1 className={styles.headerTitle}>
          Bem-vindo ao{' '}
          <span className={styles.greenText}>Contas.AI</span>
        </h1>
        <p className={styles.paragraph}>
          Controle suas despesas e tenha mais organização financeira com{' '}
          <span className={styles.redText}>Contas.AI!</span>
        </p>
        <Link href="/accounts/accounts">
          <button className={styles.button}>Acessar Contas</button>
        </Link>
      </div>
    </main>
  );
};

export default HomePage;
