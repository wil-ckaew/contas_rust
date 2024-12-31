import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import styles from '../styles/global.module.css'; // Certifique-se do caminho correto

const Contact: React.FC = () => {
  return (
    <div>
      <Header />
      {/* Fundo azul claro aplicado diretamente */}
      <main className={`${styles.container} bg-blue-100`}>
        <div className={styles.content}>
          <h1 className={styles.headerTitle}>
            Entre em <span className={styles.greenText}>Contato</span>
          </h1>
          <p>Estamos sempre prontos para ouvir suas dúvidas e sugestões.</p>
          <form className={styles.form}>
            <label htmlFor="name" className={styles.label}>
              Nome:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              required
              className={styles.input}
            />

            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Seu email"
              required
              className={styles.input}
            />

            <label htmlFor="message" className={styles.label}>
              Mensagem:
            </label>
            <textarea
              id="message"
              placeholder="Sua mensagem"
              required
              className={styles.textarea}
            ></textarea>

            <button className={styles.button} type="submit">
              Enviar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;
