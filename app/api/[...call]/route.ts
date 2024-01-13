import axios from 'axios'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { call: string } }) {
  const req = await request.json()
  const { call } = params;
  // Obtener la sesión del usuario
  const session = { apiKey: process.env.KEY, apiSecret: process.env.SECRET }

  const coin = req.coin ?? ''
  const amount = req.amount ?? ''
  const symbol = req.symbol ?? ''
  const schedule = req.schedule ?? ''

  const client = axios.create({ baseURL:'/', headers: { 'X-API-KEY': session.apiKey, 'X-API-SECRET': session.apiSecret } })

  const ip = request.headers.get('x-real-ip')
  console.log(`La dirección IP de la solicitud es ${ip}`)

  const calls = {
    
    balance: async () => {
      // Obtener el balance del usuario
      const balance = await client.post('/balance', {session})
      return await balance.data;
    },
    balances: async () => {
      // Obtener el balance del usuario
      const balances = await client.post('/balances', {session})
      return await balances.data;
    },    
    balanceOf: async () => {
      // Obtener el balance de una moneda específica
      const balance = await client.post('/balanceOf', { session, coin })
      return await balance.data;
    },
    available: async () => {
      // Obtener el disponible de una moneda específica
      const balance = await client.post('/available', { session, coin })
      return await balance.data;
    },
    buy: async () => {
      // Comprar una moneda
      const buy = await client.post('/buy', { session, coin, amount })
      return await buy.data;
    },
    sell: async () => {
      // Vender una moneda
      const sell = await client.post('/sell', { session, coin, amount })
      return await sell.data;
    },
    coins: async () => {
      // Comprar una moneda
      const coins = await client.post('/coins')
      return await coins.data;
    },
    coin: async () => {
      // Vender una moneda
      const res = await client.post('/coin', { coin })
      return await res.data;
    },
    scheduledSale: async () => {
      // Programar una venta
      const scheduleSell = await client.post('/scheduledSale', { session, coin, schedule })
      return await scheduleSell.data;
    },
    minQty: async () => {
      const minQty = await client.post('/minQty', { symbol })
      return await minQty.data;
    }
  }

  const reqCall = calls[call];
  const res = req.amount != '' ? await reqCall(req.coin, req.amount) : await reqCall();
  
  return NextResponse.json(res, { status: 200 })
}
