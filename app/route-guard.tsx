import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function RouteGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Comprueba si la cookie de la sesión existe en cada cambio de ruta
    const checkSessionCookie = () => {
      const sessionCookie = Cookies.get('connect.sid');

      if (!sessionCookie) {
        router.push('/login');
      }
    };

    // Comprueba la cookie de la sesión en la carga inicial
    checkSessionCookie();

    // Anula la suscripción a los eventos en useEffect return function
    return () => {
      // No hay un método 'off' para los eventos del router en Next.js 13
      // router.events.off('routeChangeStart', checkSessionCookie);
    };
  }, []);

  return children;
}

export default RouteGuard;
