// pages/index.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const HomePage = () => {
  return (
    <main className={styles.container}>
      <div className={styles.logoContainer}>
        <Image
          src="/images/desp.gif"
          alt="Contas ai"
          width={200}
          height={200}
        />
      </div>
      <h1 className={styles.headerTitle}>
        Bem-vindo à página da{' '}
        <span className={styles.redText}>Contas.AI</span> -{' '}
        <span className={styles.greenText}>Controle de despesas Web</span>!
      </h1>
      <p className={styles.paragraph}>
        ......Controle suas despesas atraves Contas AI......
      </p>
      <Link href="/accounts/accounts">
        <button className={styles.button}>Clique Aqui!</button>
      </Link>
    </main>
  );
};

export default HomePage;
