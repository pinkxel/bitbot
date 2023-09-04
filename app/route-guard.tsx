import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function RouteGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Comprueba si apiKey está en el almacenamiento local en cada cambio de ruta
    const checkApiKey = () => {
      const apiKey = window.localStorage.getItem('apiKey');

      if (!apiKey) {
        router.push('/login');
      }
    };

    // Comprueba apiKey en la carga inicial
    checkApiKey();

    // Anula la suscripción a los eventos en useEffect return function
    return () => {
      // No hay un método 'off' para los eventos del router en Next.js 13
      // router.events.off('routeChangeStart', checkApiKey);
    };
  }, []);

  return children;
}

export default RouteGuard;
