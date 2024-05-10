// app/route-guard.tsx
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Comprueba si la cookie de sesión 'connect.sid' existe en cada cambio de ruta
    const checkSessionCookie = () => {
      const sessionCookie = Cookies.get('connect.sid'); // Busca la cookie 'connect.sid'

      console.log("/////////////////!sessionCookie");
      console.log(sessionCookie);
      console.log(!sessionCookie);
      // Si no hay cookie de sesión 'connect.sid', redirige al usuario a la página de inicio de sesión
      if (!sessionCookie) {
        router.push('/login');
      }
    };

    // Comprueba la cookie de sesión 'connect.sid' en la carga inicial y en cada cambio de ruta
    checkSessionCookie();
  }, [pathname]); // Incluye pathname en el array de dependencias para detectar cambios de ruta

  return children;
}

export default RouteGuard;
