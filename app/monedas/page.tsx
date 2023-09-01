'use client'

import { Card, Table } from "flowbite-react"

export default function Monedas() {
  return (
    <Card>
      <h1>Monedas</h1>
      <Table>
        <Table.Body className="dark:border-gray-700">
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