'use client'

import { Card, Button } from 'flowbite-react';
import axios from 'axios';

export default function Cuenta() {
  /*const clearSession = () => {
    localStorage.clear()
    window.location.reload()
  }*/

  const clearSession = async () => {
    try {
      console.log('porinponpin');
      const response = await axios.post('/api/logout', {});
      if (response.status === 200) {
        localStorage.removeItem('apiKey');
        localStorage.removeItem('apiSecret');
        window.location.reload()
      } else {
        // Manejar errores de cierre de sesión aquí
      }
    } catch (error) {
      console.error(error);
      // Manejar errores de red aquí
    }
  };

  return (
    <Card>
      <h1>Mi cuenta</h1>
      <Button onClick={clearSession}>
        Cerrar sesión
      </Button>
    </Card>
  )
}