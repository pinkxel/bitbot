'use client'

import { useEffect, useState } from 'react';
import { Card, Button, Label, RangeSlider } from 'flowbite-react';

export default function Page({ params }: { params: { operar: string } }) {
  const [session, setSession] = useState({});
  const [balanceOf, setBalanceOf] = useState('--');

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey')
    const secretKey = localStorage.getItem('secretKey')
    setSession({ apiKey, secretKey });
    const id = params.operar[1]

    async function fetchBalanceOf(apiKey, secretKey) {
      try {
        const response = await fetch('/api/balanceOf', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, secretKey }, coin: id})
        });
        const data = await response.json()
        console.log('data', data)
        setBalanceOf(data);
        //console.log('Balances', data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchBalanceOf(apiKey, secretKey);
  }, [])

  return (
    <Card>
      <h1>{params.operar[1]}</h1>
      <h2>En esta moneda tienes</h2>
      <p>$ {balanceOf}</p>
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