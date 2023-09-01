'use client'

import { Card, Button } from 'flowbite-react';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Card>
      <h1>{params.id}</h1>
      <h2>Precio actual</h2>
      <p>$ 29420</p>
      <h2>Cuánto tienes en BTC</h2>
      <p>$ 60</p>
      <h2>¿Qué quieres hacer?</h2>
      <div className="flex gap-2">
        <Button>
          Comprar
        </Button>
        <Button>
          Vender
        </Button>
      </div>
    </Card>
  )
}