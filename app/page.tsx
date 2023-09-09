'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link'

import { Card, Table } from 'flowbite-react';

export default function Inicio() {
  // Crear un estado para almacenar el balance del usuario
  const [session, setSession] = useState({});
  const [balance, setBalance] = useState('--');
  const [balances, setBalances] = useState([]);

  // Obtener el balance del usuario al montar el componente
  useEffect(() => {
    
    const apiKey = localStorage.getItem('apiKey');
    const secretKey = localStorage.getItem('secretKey');

    setSession({ apiKey, secretKey });
    async function fetchBalance(apiKey, secretKey) {
      try {
        const response = await fetch('/api/balance', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, secretKey }})
        });
        const data = await response.json();
        //console.log('Balance', data)
        setBalance(data.toFixed(2));
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchBalances(apiKey, secretKey) {
      try {
        const response = await fetch('/api/balances', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, secretKey }})
        });
        const data = await response.json();
        setBalances(data);
        //console.log('Balances', data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchBalance(apiKey, secretKey);
    fetchBalances(apiKey, secretKey);
  }, []);

  return (
    <Card>
      <h2>En tu cuenta tienes:</h2>
      {/*<p className='text-4xl'>{balances.map(asset => (
          <li key={asset.asset}>{asset.asset}: {parseFloat(asset.unrealizedProfit) + parseFloat(asset.walletBalance)}</li>
      ))}</p> */}
      <p className='text-4xl'>{balance}</p>
      <h2>Repartido en estas monedas:</h2>
      <Table>
        <Table.Body>
        {balances.map((asset) => (
          <Table.Row key={asset.asset}>
            <Table.Cell>
              <Link href={`/monedas/${encodeURIComponent(asset.asset)}`}>{asset.asset}</Link>
            </Table.Cell>
            <Table.Cell>
              <Link href={`/monedas/${encodeURIComponent(asset.asset)}`}>{parseFloat(asset.free) + parseFloat(asset.locked)}</Link>
            </Table.Cell>
          </Table.Row>
        ))}
        </Table.Body>
      </Table>
    </Card>
  )
}
