'use client'

import { Card, Button, Label, RangeSlider } from 'flowbite-react';

export default function Page({ params }: { params: { operar: string } }) {
  return (
    <Card>
      <h1>{params.operar[1]}</h1>
      <h2>En esta moneda tienes</h2>
      <p>$ 60</p>
      <h2>¿Cuánto quieres comprar?</h2>
      <p>Disponibles $ 60</p>
      <Label htmlFor="default-range" value="Default"/>
      <RangeSlider id="default-range"/>
      <p>Igual a 0.0001 BTC</p>
      <div className="flex gap-2">
        <Button>
          {params.operar[0]}
        </Button>
      </div>
    </Card>
  )
}