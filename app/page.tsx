'use client';

import { Card, Table } from 'flowbite-react';

export default function Inicio() {
  return (
    <Card>
      <h2>En tu cuenta tienes:</h2>
      <p className='text-4xl'>$100</p>
      <h2>Repartido en estas monedas:</h2>
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              Dólar USD
            </Table.Cell>
            <Table.Cell>
              $1
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Bitcoin BTC
            </Table.Cell>
            <Table.Cell>
              $28880
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Ethereum
            </Table.Cell>
            <Table.Cell>
              $1820
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Card>
  )
}


