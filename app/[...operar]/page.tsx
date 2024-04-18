'use client'

import { useEffect, useState } from 'react'
import { Card, Button, Label, RangeSlider, TextInput, Modal } from 'flowbite-react'

export default function Page({ params }: { params: { operar: string } }) {
  const [session, setSession] = useState({apiKey:'', apiSecret:''})
  const [balanceOf, setBalanceOf] = useState('--')
  const [available, setAvailable] = useState('--')
  const [amount, setAmount] = useState(0)
  const [coin, setCoin] = useState('--')
  const [openModal, setOpenModal] = useState<string | undefined>()
  const props = { openModal, setOpenModal }

  async function fetchData() {
    const apiKey = localStorage.getItem('apiKey') as string
    const apiSecret = localStorage.getItem('apiSecret') as string
    setSession({ apiKey, apiSecret });
    const id = params.operar[1]

    async function fetchBalanceOf(apiKey : string, apiSecret : string) {
      try {
        const response = await fetch('/api/balanceOf', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, apiSecret }, coin: id})
        });
        const data = await response.json()
        setBalanceOf(data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchAvailable(apiKey : string, apiSecret : string) {      
      try {
        console.log('test');
        const response = await fetch('/api/available', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, apiSecret }, coin: params.operar[0] == 'comprar' ? 'USDT' : id })
        });
        const data = await response.json()
        console.log('data', data)
        setAvailable(data)
      } catch (error) {
        console.log('testError');
        console.error(error);
      }
    }
    async function fetchCoin(apiKey : string, apiSecret : string) {
      try { 
        const response = await fetch('/api/coin', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, apiSecret }, coin: id})
        });
        const data = await response.json();
        setCoin(data);
        //console.log('Balances', data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchCoin(apiKey, apiSecret)
    fetchBalanceOf(apiKey, apiSecret)
    fetchAvailable(apiKey, apiSecret)
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchMinQty(apiKey : string, apiSecret : string, symbol : string) {
    try {
      console.log('symbol!!!!!!!11', symbol);
      const response = await fetch('/api/minQty', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({session: { apiKey, apiSecret }, symbol: symbol})
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  
  // Función auxiliar para llamar a la API según el valor de params.operar[0]
  async function handleOperation(apiKey : string, apiSecret : string, coin : string, amount : number) {
    try {
      console.log('coin', coin);
      const minQty = await fetchMinQty(apiKey, apiSecret, coin + 'USDT'); 
      console.log('minQty', minQty);

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
        body: JSON.stringify({session: { apiKey, apiSecret }, coin, amount})
      });
      // Obtener la respuesta de la API y mostrarla por consola
      const data = await response.json();
      console.log(data)
      fetchData()
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card>
      <h1>{params.operar[1]}</h1>
      <h2>En esta moneda tienes:</h2>
      <p>$ {balanceOf}</p>
      <h2>¿Cuánto quieres {params.operar[0]}?  </h2>
      <Label htmlFor="range" value={`Disponibles $ ${params.operar[0] == 'comprar' ? available : balanceOf}`}/>
      <RangeSlider id="range"
        min={0}
        max={params.operar[0] == 'comprar' ? available : balanceOf}
        step={.01}
        value={amount}
        onChange={(event) => {
          console.log('AMOUNT', amount);
          setAmount(parseFloat(event.target.value) || 0); // actualizar el estado local con el valor
        }}
      />
      <TextInput
        id="amount"
        placeholder="--"
        value={amount}
        onChange={(event) => {
          console.log('VALUE', event.target.value)
          //const value = event.target.value == '' ? 0 : event.target.value
          const amount = parseFloat(event.target.value) || 0
          const percentage = amount / parseFloat(balanceOf)

          setAmount(parseFloat(available) * percentage) // actualizar el estado local con el valor del input
        }}
        required />
      <p>Igual a { (amount / parseFloat(coin)).toFixed(4) } {params.operar[1]}</p>
      <div className="flex gap-2">
      <Button className="capitalize" onClick={() => props.setOpenModal('pop-up')}>
        {params.operar[0]}
      </Button>
      <Modal show={props.openModal === 'pop-up'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro que desea {params.operar[0]}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                console.log('coin', coin, 'amount', amount)
                const coinAmount = parseFloat((amount / parseFloat(coin)).toFixed(5));
                console.log('coinAmount!', coinAmount);
                handleOperation(session.apiKey, session.apiSecret, params.operar[1], coinAmount)
                props.setOpenModal(undefined)
              }}>
                Si, estoy seguro
              </Button>
              <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </div>
    </Card>
  )
}