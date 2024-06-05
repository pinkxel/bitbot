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
  const [isAutoSaleRunning, setIsAutoSaleRunning] = useState(false);

  const [earnAmount, setEarnAmount] = useState(0)
  const [earnAmountText, setEarnAmountText] = useState('')
  const [loseAmount, setLoseAmount] = useState(0)
  const [loseAmountText, setLoseAmountText] = useState('')
  const [reSaleTime, setreSaleTime] = useState(0)
  const [reSaleTimeText, setreSaleTimeText] = useState('')

  const [openModal, setOpenModal] = useState<string | undefined>()
  const [caseModal, setCaseModal] = useState<string | undefined>()
  const props = { openModal, setOpenModal, caseModal, setCaseModal }

  const userId = localStorage.getItem('userId');

  async function fetchData() {
    console.log('params', params)
    const apiKey = localStorage.getItem('apiKey') as string
    const apiSecret = localStorage.getItem('apiSecret') as string
    const { id } = params

    setSession({ apiKey, apiSecret });

    async function fetchCoin(apiKey : string, apiSecret : string) {
      try {
        const response = await fetch('/api/coin', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({coin: id})
        });
        const data = await response.json();
        console.log('Balances', data)
        setCoin(data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchBalanceOf(apiKey : string, apiSecret : string) {
      try {
        const response = await fetch('/api/balanceOf', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({coin: id})
        });
        const data = await response.json();
        console.log('BalanceOf', data);
        setBalanceOf(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBalanceOf(apiKey, apiSecret);
    fetchCoin(apiKey, apiSecret);
  }

  useEffect(() => {
    if(localStorage.getItem('isAutoSaleEnabled')) {
      setIsAutoSaleRunning(true);
    }
    setIsAutoSaleEnabled(JSON.parse(localStorage.getItem('isAutoSaleEnabled') || 'false'));
    setEarnAmount(JSON.parse(localStorage.getItem('earnAmount') || '0'));
    setEarnAmountText(JSON.parse(localStorage.getItem('earnAmount') || '0'));
    setLoseAmount(JSON.parse(localStorage.getItem('loseAmount') || '0'));
    setLoseAmountText(JSON.parse(localStorage.getItem('loseAmount') || '0'));
    setreSaleTime(JSON.parse(localStorage.getItem('reSaleTime') || '0'));
    setreSaleTimeText(JSON.parse(localStorage.getItem('reSaleTime') || '0'));

    fetchData();
  }, [])

  const handleAutoSaleChange = (event) => {
    console.log(event.target.checked);
    if(isAutoSaleRunning) {
      props.setOpenModal('pop-up'); props.setCaseModal('detener');
    } else {
      setIsAutoSaleEnabled(event.target.checked);
    }
  };

  const handleCreateScheduledSale = async (apiKey : string, apiSecret : string, coin: string, schedule : any) => {
    try {
      const { earnAmount, loseAmount, reSaleTime } = schedule;

      // Define the API endpoint
      const apiEndpoint = "/api/scheduledSale";

      console.log("coin ### ", coin);
  
      // Define the request body
      const requestBody = {
        coin,
        schedule,
        userId
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
      
      localStorage.setItem('isAutoSaleEnabled', JSON.stringify(isAutoSaleEnabled));
      localStorage.setItem('earnAmount', JSON.stringify(earnAmount));
      localStorage.setItem('loseAmount', JSON.stringify(loseAmount));
      localStorage.setItem('reSaleTime', JSON.stringify(reSaleTime));

      localStorage.setItem('userOrder', JSON.stringify(data));

      setIsAutoSaleRunning(true);

      fetchData()
    } catch (error) {
      console.error('Error creating scheduled sale', error);
    }
  }

  const handleCancelScheduledSale = async (apiKey : string, apiSecret : string, coin: string, schedule : any) => {
    try {
      // Define the API endpoint
      const apiEndpoint = "/api/cancelScheduledSale";
      const userOrder = localStorage.getItem('userOrder');

      if(userOrder) {
        const orderListId = JSON.parse(userOrder).orderListId;
        console.log('orderListId', orderListId);

        // Define the request body
        const requestBody = {
          orderListId,
          coin,
          schedule,
          userId
        };
        
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

        console.log(data);
        
        localStorage.removeItem('isAutoSaleEnabled');
        localStorage.removeItem('earnAmount');
        localStorage.removeItem('loseAmount');
        localStorage.removeItem('reSaleTime');
  
        localStorage.removeItem('userOrder');

        setIsAutoSaleRunning(false);
        setIsAutoSaleEnabled(false);

        fetchData()
      }
    } catch(error) {
      console.error('Error canceling scheduled sale', error);
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
      <RangeSlider disabled={!isAutoSaleEnabled || isAutoSaleRunning}
        id="earnAmountRange"
        min={0}
        max={10}//params.operar[0] == 'comprar' ? available : balanceOf}
        step={.01}
        value={earnAmount}
        onChange={(event) => {
          const amout = parseFloat(event.target.value) || 0
          setEarnAmount(amout) // actualizar el estado local con el valor
          setEarnAmountText(amout + '% de ganancia');
        }}
      />
      <TextInput disabled={!isAutoSaleEnabled || isAutoSaleRunning}
        id="earnAmountTextInput"
        placeholder="----"
        value={earnAmountText}
        onChange={(event) => {
          const value = event.target.value;
          let amount;
          console.log(value)
          //const value = event.target.value == '' ? 0 : event.target.value

          // Verificar si el último carácter es un punto
          if (value[value.length - 1] === '.') {
            amount = value; // Mantener el punto en el valor
          } else {
            amount = (parseFloat(value) || ''); // Parsear el valor numérico
          }
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
      <RangeSlider disabled={!isAutoSaleEnabled || isAutoSaleRunning}
        id="loseAmountRange"
        min={0}
        max={100}//params.operar[0] == 'comprar' ? available : balanceOf}
        step={.1}
        value={loseAmount}
        onChange={(event) => {
          const loseAmount = parseFloat(event.target.value) || 0 
          setLoseAmount(loseAmount) // actualizar el estado local con el valor
          setLoseAmountText(loseAmount + '% de pérdida')
        }}
      />
      <TextInput disabled={!isAutoSaleEnabled || isAutoSaleRunning}
        id="loseAmountTextInput"
        placeholder="----"
        value={loseAmountText}
        onChange={(event) => {
          //console.log(event.target.value)
          //const value = event.target.value == '' ? 0 : event.target.value
          //const amount = parseFloat(event.target.value) || 0

          //const percentage = amount / parseFloat(balanceOf)

          const value = event.target.value;
          let amount;
          console.log(value)
          //const value = event.target.value == '' ? 0 : event.target.value

          // Verificar si el último carácter es un punto
          if (value[value.length - 1] === '.') {
            amount = value; // Mantener el punto en el valor
          } else {
            amount = (parseFloat(value) || ''); // Parsear el valor numérico
          }

          setLoseAmount(amount) // actualizar el estado local con el valor del input
          setLoseAmountText(amount)
        }}
        onBlur={(event) => {
          const amount = parseFloat(event.target.value) || 0
          setLoseAmountText(amount + '% de pérdida')
        }}
        required />
      <h2>Volver a comprar durante:</h2>
      <RangeSlider disabled={!isAutoSaleEnabled || isAutoSaleRunning}
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
      <TextInput disabled={!isAutoSaleEnabled || isAutoSaleRunning}
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
      {
        !isAutoSaleRunning && (
          <div className="flex">
            <Button disabled={!isAutoSaleEnabled}  
              onClick={() => { props.setOpenModal('pop-up'); props.setCaseModal('crear') }}>
              Crear venta programada
            </Button>
          </div>
        )
      }
      <Modal show={props.openModal === 'pop-up'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro que desea {props.caseModal} la venta programada?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                console.log("props.caseModal", props.caseModal);
                if(props.caseModal == 'crear') {
                  console.log("handleCreateScheduledSale");
                  handleCreateScheduledSale(session.apiKey, session.apiSecret, params.id, { earnAmount, loseAmount, reSaleTime })
                } else {
                  console.log("handleCancelScheduledSale");
                  handleCancelScheduledSale(session.apiKey, session.apiSecret, params.id, { earnAmount, loseAmount, reSaleTime })
                }
                props.setOpenModal(undefined);
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
      { isAutoSaleRunning && (
        <div>
          <legend>
            ¡Listo!
          </legend>
          <div className="flex">
            <legend className="mb-4 w-64">
            Se venderá con un {earnAmount}% de ganancia o un {loseAmount}% de pérdida.
            Y se volverá a comprar y vender durante {reSaleTime} segundos.
            </legend>
          </div>
        </div>
      )}
      { isAutoSaleRunning && (
        <div className="flex">
          <Button color="gray" disabled={!isAutoSaleEnabled} 
            onClick={() => {props.setOpenModal('pop-up'); props.setCaseModal('detener')}}>
            Cancelar
          </Button>
        </div>
      )}
      { /*
      <Button color="gray" onClick={ async () => {
              const response = await fetch('/api/x', {
                method: "POST",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify('')
              });
              console.log(response)

      }}>
        Test
    </Button> */}
    </Card>
  )
}