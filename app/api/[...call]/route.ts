// api/[...call]/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { call: string } }) {
  const req = await request.json();
  const { call } = params;
  // Obtener la sesión del usuario
  const session = { apiKey: process.env.KEY, apiSecret: process.env.SECRET }

  const { 
    coin,
    amount,
    symbol,
    schedule,
    username,
    password,
    apiKey,
    apiSecret
  } = req;

  const client = axios.create({ baseURL:'/', headers: { 'X-API-KEY': session.apiKey, 'X-API-SECRET': session.apiSecret } })

  const ip = request.headers.get('x-real-ip')
  console.log(`La dirección IP de la solicitud es ${ip}`)

  const calls = {
    // Inicio de sesión
    login: async () => {
      const response = await axios.post('/login', { username, password });
      if (response.status === 200) {
        return { status: 200, message: 'Inicio de sesión exitoso', userId: response.data.userId };
      } else {
        return { status: 400, message: 'Nombre de usuario o contraseña incorrectos' };
      }
    },

    // Cierre de sesión
    logout: async () => {
      console.log('hasta acá');
      await axios.post('/logout');
      return { status: 200, message: 'Sesión cerrada con éxito' };
    },

    // Registro
    register: async () => {
      console.log( username, password, apiKey, apiSecret );
      const response = await axios.post('/register', { username, password, apiKey, apiSecret });
      if (response.status === 200) {
        return { status: 200, message: 'Usuario registrado con éxito', userId: response.data.userId };
      } else {
        return { status: 400, message: 'Error al registrar el usuario' };
      }
    },
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
  //const res = req.amount != '' ? await reqCall(req.coin, req.amount) : await reqCall();
  const res = await reqCall();
  
  return NextResponse.json(res, { status: 200 })
}
