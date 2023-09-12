'use client'

import { Card, Button } from 'flowbite-react';

export default function Cuenta() {
  const clearSession = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <Card>
      <h1>Mi cuenta</h1>
      <Button onClick={clearSession}>
        Cerrar sesión
      </Button>
    </Card>
  )
}