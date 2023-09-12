'use client'

import { useEffect, useState } from 'react';

import { Card, Button } from 'flowbite-react';
import Link from 'next/link';

export default function Page({ params }: { params: { id: string } }) {
  const [session, setSession] = useState({});
  const [coin, setCoin] = useState('--')
  const [balances, setBalances] = useState([]);
  const [balanceOf, setBalanceOf] = useState('--');
  const isUSDT = params.id === 'USDT' ? 'hidden' : ''

  useEffect(() => {
    console.log('params', params)
    const apiKey = localStorage.getItem('apiKey') as string
    const secretKey = localStorage.getItem('secretKey') as string
    const { id } = params

    setSession({ apiKey, secretKey });

    async function fetchCoin(apiKey : string, secretKey : string) {
      try {
        const response = await fetch('/api/coin', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, secretKey }, coin: id})
        });
        const data = await response.json();
        setCoin(data);
        //console.log('Balances', data)
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchBalanceOf(apiKey : string, secretKey : string) {
      try {
        const response = await fetch('/api/balanceOf', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, secretKey }, coin: id})
        });
        const data = await response.json();
        setBalanceOf(data);
        //console.log('Balances', data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchBalanceOf(apiKey, secretKey);
    fetchCoin(apiKey, secretKey);
  }, [])
  
  return (
    <Card>
      <h1>{params.id}</h1>
      <h2 className={`${isUSDT}`}>Precio actual:</h2>
      <p className={`text-4xl ${isUSDT}`}>$ {coin}</p>
      <h2>Cuánto tienes en {params.id}:</h2>
      <p>$ {balanceOf}</p>
      <h2 className={`${isUSDT}`}>¿Qué quieres hacer?</h2>
      <div className={`flex gap-2 ${isUSDT}`}>
        <Button>
          <Link href={`/comprar/${encodeURIComponent(params.id)}`}>Comprar</Link>
        </Button>
        <Button>
        <Link href={`/vender/${encodeURIComponent(params.id)}`}>Vender</Link>
        </Button>
      </div>
    </Card>
  )
}