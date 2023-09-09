'use client'

import { useEffect, useState } from 'react'
import { Card, Table } from 'flowbite-react'
import Link from 'next/link'

export default function Monedas() {
  const [session, setSession] = useState({});
  const [coins, setCoins] = useState([])

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey')
    const secretKey = localStorage.getItem('secretKey')

    async function fetchCoins(apiKey, secretKey) {
      try {
        const response = await fetch('/api/coins', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({session: { apiKey, secretKey }})
        });
        const data = await response.json();
        setCoins(data);
        console.log('Monedas', data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchCoins(apiKey,secretKey)
  }, [])

  return (
    <Card>
      <h1>Monedas</h1>
      <Table>
        <Table.Body className="dark:border-gray-700">
        {coins.map((coin) => (
          <Table.Row>
            <Table.Cell>
              <Link href={`/monedas/${encodeURIComponent(coin.coin)}`}>{coin.coin}</Link>
            </Table.Cell>
            <Table.Cell>
            <Link href={`/monedas/${encodeURIComponent(coin.coin)}`}>${coin.price}</Link>
            </Table.Cell>
          </Table.Row>
        ))}
        </Table.Body>
      </Table>
    </Card>
  )
}