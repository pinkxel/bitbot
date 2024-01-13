'use client'

import { useEffect, useState } from 'react';

import { Card, Button, Label, Checkbox, RangeSlider, TextInput, Modal } from 'flowbite-react';
import Link from 'next/link';

export default function Page({ params }: { params: { id: string } }) {  
  const [session, setSession] = useState({});
  const [coin, setCoin] = useState('--')
  const [balances, setBalances] = useState([]);
  const [balanceOf, setBalanceOf] = useState('--');
  const isUSDT = params.id === 'USDT' ? 'hidden' : '';
  const [isAutoSaleEnabled, setIsAutoSaleEnabled] = useState(false);

  const [earnAmount, setEarnAmount] = useState(0)
  const [earnAmountText, setEarnAmountText] = useState('')
  const [loseAmount, setLoseAmount] = useState(0)
  const [loseAmountText, setLoseAmountText] = useState('')
  const [reSaleTime, setreSaleTime] = useState(0)
  const [reSaleTimeText, setreSaleTimeText] = useState('')

  const [openModal, setOpenModal] = useState<string | undefined>()
  const props = { openModal, setOpenModal }

  async function fetchData() {
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
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAutoSaleChange = (event) => {
    console.log(event.target.checked)
    setIsAutoSaleEnabled(event.target.checked)
  };

  const handleCreateScheduledSale = async (apiKey : string, secretKey : string, coin: string, schedule : any) => {
      try {
        const { earnAmount, loseAmount, reSaleTime } = schedule;

        // Define the API endpoint
        const apiEndpoint = "/api/scheduledSale";

        console.log("coin ### ", coin);
    
        // Define the request body
        const requestBody = {
          session: { apiKey, secretKey },
          coin,
          schedule
        };

        console.log('coin, schedule', coin, schedule);
        // Make the API request
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });
    
        // Parse the response data
        const data = await response.json();
    
        // Log the response data
        console.log('Scheduled sale created', data);

        fetchData()
      } catch (error) {
        console.error('Error creating scheduled sale', error);
      }
    }
    
  
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
      <h2>¿Deseas progamar tu venta?</h2>
      <div className="flex items-center gap-2">
        <Checkbox id="autoSale" checked={isAutoSaleEnabled} onChange={handleAutoSaleChange} />
        <Label htmlFor="autoSale">
          Sí, utilizar ventas programadas.
        </Label>
      </div>
 
      <h2>¿Vender con cuánto de ganancia?</h2>
      <RangeSlider disabled={!isAutoSaleEnabled}
        id="earnAmountRange"
        min={0}
        max={100}//params.operar[0] == 'comprar' ? available : balanceOf}
        step={1}
        value={earnAmount}
        onChange={(event) => {
          const amout = parseFloat(event.target.value) || 0
          setEarnAmount(amout) // actualizar el estado local con el valor
          setEarnAmountText(amout + '% de ganancia');
        }}
      />
      <TextInput disabled={!isAutoSaleEnabled}
        id="earnAmountTextInput"
        placeholder="--"
        value={earnAmountText}
        onChange={(event) => {
          console.log(event.target.value)
          //const value = event.target.value == '' ? 0 : event.target.value
          const amount = parseFloat(event.target.value) || 0
          //const percentage = amount / parseFloat(balanceOf)

          setEarnAmount(amount) // actualizar el estado local con el valor del input
          setEarnAmountText(amount)
        }}
        onBlur={(event) => {
          const amount = parseFloat(event.target.value) || 0
          setEarnAmountText(amount + '% de ganancia')
        }}
        required />
    <h2>¿Vender con cuánto de pérdida?</h2>
      <RangeSlider disabled={!isAutoSaleEnabled}
        id="loseAmountRange"
        min={0}
        max={100}//params.operar[0] == 'comprar' ? available : balanceOf}
        step={1}
        value={loseAmount}
        onChange={(event) => {
          const loseAmount = parseFloat(event.target.value) || 0 
          setLoseAmount(loseAmount) // actualizar el estado local con el valor
          setLoseAmountText(loseAmount + '% de pérdida')
        }}
      />
      <TextInput disabled={!isAutoSaleEnabled}
        id="loseAmountTextInput"
        placeholder="--"
        value={loseAmountText}
        onChange={(event) => {
          console.log(event.target.value)
          const value = event.target.value == '' ? 0 : event.target.value
          const amount = parseFloat(event.target.value) || 0
          //const percentage = amount / parseFloat(balanceOf)

          setLoseAmount(amount) // actualizar el estado local con el valor del input
          setLoseAmountText(amount)
        }}
        onBlur={(event) => {
          const amount = parseFloat(event.target.value) || 0
          setLoseAmountText(amount + '% de pérdida')
        }}
        required />
      <h2>Volver a comprar durante:</h2>
      <RangeSlider disabled={!isAutoSaleEnabled}
        id="reSaleTimeRange"
        min={0}
        max={1000}//params.operar[0] == 'comprar' ? available : balanceOf}
        step={1}
        value={reSaleTime}
        onChange={(event) => {
          const reSaleTime = parseFloat(event.target.value) || 0
          setreSaleTime(reSaleTime);
          setreSaleTimeText(reSaleTime + ' segundos'); // actualizar el estado local con el valor
        }}
      />
      <TextInput disabled={!isAutoSaleEnabled}
        id="reSaleTimeTextInput"
        placeholder="--"
        value={reSaleTimeText}
        required
        onChange={(event) => {
          console.log(event.target.value)
          const value = event.target.value == '' ? 0 : event.target.value
          const reSaleTime = parseFloat(event.target.value) || 0
          //const percentage = amount / parseFloat(balanceOf)

          setreSaleTime(reSaleTime) // actualizar el estado local con el valor del input
          setreSaleTimeText(reSaleTime)
        }}
        onBlur={(event) => {
          const amount = parseFloat(event.target.value) || 0
          setreSaleTimeText(amount + ' segundos')
        }}
      />
      <div className="flex">
        <Button disabled={!isAutoSaleEnabled}  
          onClick={() => props.setOpenModal('pop-up')}>
          Crear venta programada
        </Button>
      </div>
      <Modal show={props.openModal === 'pop-up'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro que desea crear la venta programada?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                handleCreateScheduledSale(session.apiKey, session.secretKey, params.id, { earnAmount, loseAmount, reSaleTime })
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
      <legend>
        ¡Listo!
      </legend>
      <div className="flex">
        <legend className="mb-4 w-64">
        Se venderá con un XX de ganancia o un 25% de pérdida.
        Y se volverá a comprar y vender durante 1 hora.
        </legend>
      </div>
      <div className="flex">
        <Button color="gray" disabled={!isAutoSaleEnabled} 
          onClick={() => props.setOpenModal(undefined)}>
          Cancelar
        </Button>
      </div>
    </Card>
  )
}