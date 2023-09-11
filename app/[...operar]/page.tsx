'use client'

import { useEffect, useState } from 'react'
import { Card, Button, Label, RangeSlider, TextInput } from 'flowbite-react'

export default function Page({ params }: { params: { operar: string } }) {
  const [session, setSession] = useState({});
  const [balanceOf, setBalanceOf] = useState('--');
  const [available, setAvailable] = useState('--');
  const [amount, setAmount] = useState(0);
  const [coin, setCoin] = useState('--')

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
        setBalanceOf(data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchAvailable(apiKey, secretKey) {      
      try {
        const response = await fetch('/api/available', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, secretKey }, coin: params.operar[0] == 'comprar' ? 'USDT' : id })
        });
        const data = await response.json()
        console.log('data', data)
        setAvailable(data)
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchCoin(apiKey, secretKey) {
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
    fetchCoin(apiKey, secretKey)
    fetchBalanceOf(apiKey, secretKey)
    fetchAvailable(apiKey, secretKey)
  }, [])
  
  // Función auxiliar para llamar a la API según el valor de params.operar[0]
  async function handleOperation(apiKey, secretKey, coin, amount) {
    try {
      // Determinar la ruta de la API según el valor de params.operar[0]
      let apiRoute;
      if (params.operar[0] === "comprar") {
        apiRoute = "/api/buy";
      } else if (params.operar[0] === "vender") {
        apiRoute = "/api/sell";
      } else {
        throw new Error("Operación inválida");
      }
      // Llamar a la API con los datos necesarios
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({session: { apiKey, secretKey }, coin, amount})
      });
      // Obtener la respuesta de la API y mostrarla por consola
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card>
      <h1>{params.operar[1]}</h1>
      <h2>En esta moneda tienes</h2>
      <p>$ {balanceOf}</p>
      <h2>¿Cuánto quieres comprar?  </h2>
      <Label htmlFor="range" value={`Disponibles $ ${params.operar[0] == 'comprar' ? available : balanceOf}`}/>
      <TextInput
        id="amount"
        placeholder="--"
        value={amount}
        onChange={(event) => {
          console.log(event.target.value)
          //const value = event.target.value == '' ? 0 : event.target.value
          const amount = parseFloat(event.target.value) || 0
          const percentage = amount / parseFloat(balanceOf)

          setAmount(parseFloat(available) * percentage) // actualizar el estado local con el valor del input
        }}
        required />
      <RangeSlider id="range"
        min={0}
        max={params.operar[0] == 'comprar' ? available : balanceOf}
        step={.01}
        value={amount}
        onChange={(event) => {
          setAmount(parseFloat(event.target.value) || 0); // actualizar el estado local con el valor
        }}
      />
      <p>Igual a { (amount / parseFloat(coin)).toFixed(4) } {params.operar[1]}</p>
      <div className="flex gap-2">
      <Button className="capitalize" onClick={() => handleOperation(session.apiKey, session.secretKey, params.operar[1], (amount / parseFloat(coin)).toFixed(4))}>
        {params.operar[0]}
      </Button>
      </div>
    </Card>
  )
}