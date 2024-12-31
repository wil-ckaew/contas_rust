import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import styles from '../styles/global.module.css'; // Certifique-se do caminho correto

function About() {
  return (
    <div>
      <Header />
      <main className={`${styles.container} bg-blue-100`}>
        <div className={styles.content}>
          <h1 className={styles.headerTitle}>Sobre a Empresa</h1>
          <p className={styles.greenText}>Nossa missão é fornecer soluções inovadoras.</p>
          <p>
            Estamos comprometidos em oferecer o melhor serviço para nossos clientes. 
            Trabalhamos com paixão, dedicação e um time de excelência.
          </p>
          <button className={styles.button}>Saiba mais</button>
        </div>
      </main>
    </div>
  );
}

export default About;
