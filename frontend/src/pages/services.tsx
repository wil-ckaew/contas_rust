import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import styles from '../styles/global.module.css'; // Certifique-se do caminho correto

interface ErrorResponse {
  message?: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services'); // Substitua pelo endpoint correto
        setServices(response.data.services || []);
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const message =
          axiosError.response?.data?.message ||
          'Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.';
        setError(message);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <Header />
      <main className={`${styles.container} bg-blue-100`}>
        <div className={styles.content}>
          <h1 className={styles.headerTitle}>
            Nossos <span className={styles.greenText}>Serviços</span>
          </h1>

          {/* Painel estilizado */}
          <div className={styles.panel}>
            {error ? (
              <div className={styles.errorPanel}>
                <p className={styles.errorMessage}>{error}</p>
              </div>
            ) : services.length === 0 ? (
              <p className={styles.loadingMessage}>Carregando serviços...</p>
            ) : (
              <ul className={styles.list}>
                {services.map((service, index) => (
                  <li key={index} className={styles.greenText}>
                    {service}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className={styles.button}
            onClick={() => router.push('/contact')}
          >
            Entre em Contato
          </button>
        </div>
      </main>
    </div>
  );
};

export default Services;
