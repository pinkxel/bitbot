// api/[...call]/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server'

const api = axios.create({
  // Configura Axios para enviar cookies con cada solicitud
  withCredentials: true,
  baseURL: 'http://localhost'
});

export async function POST(request: Request, { params }: { params: { call: string }}) {
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
      try {
        const loginResponse = await api.post('/login', { username, password });
        if (loginResponse.status === 200) {
          console.log('API login data');
          // Asumiendo que la respuesta es JSON y no necesita ser parseada
          console.log(loginResponse.data);
          return {
            status: 200,
            message: 'Inicio de sesión exitoso',
            userData: {
              userId: loginResponse.data.userId,
              userOrder: loginResponse.data.userOrder
            }
          };
        }
      } catch (error) {
        // Manejo de errores en caso de que la respuesta no sea 200
        console.error(error.response ? error.response.data : error.message);
        return {
          status: error.response ? error.response.status : 500,
          message: 'Error al iniciar sesión'
        };
      }
    },

    // Cierre de sesión
    logout: async () => {
      console.log('hasta acá');
      await axios.post('/logout');
      return { status: 200, message: 'Sesión cerrada con éxito' };
    },

    // Registro
    register: async (res: any) => {
      try {
        console.log( username, password, apiKey, apiSecret );
        const response = await api.post('/register', { username, password, apiKey, apiSecret });
        if (response.status === 200) {
          const data = response.data;
          console.log('API register data');
          console.log(data);

          // Mostrar las cookies en la consola
          const sessionCookie = response.headers['set-cookie'];
          console.log('Cookies devueltas por el servidor:', sessionCookie);

          // Establecer la cookie en la cabecera de respuesta para el cliente
          //res.setHeader('Set-Cookie', sessionCookie);

          return {
            sessionCookie: sessionCookie,
            message: 'Inicio de sesión exitoso',
            userData: {
              userId: response.data.userId,
              userOrder: response.data.userOrder,
              //authToken: response.data.authToken,
            }
          };
        } else {
          return { status: 400, message: 'Error al registrar el usuario' };
        }
      } catch (error) {
        console.error('Error al registrar:', error.message);
        // Aquí puedes manejar el error de la manera que prefieras
        // (por ejemplo, mostrar un mensaje al usuario o intentar de nuevo).
        throw error; // Opcional: relanzar la excepción para que otros manejadores la capturen
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
      try {
        // Comprar una moneda
        const buy = await client.post('/buy', { session, coin, amount });
        console.log(buy);
        return await buy.data;
      } catch (error) {
        console.error('Error al comprar: NEW', );
        // Personaliza la respuesta de error según tus necesidades
        console.log(error.response.status);
        if (error.response.status === 422) {
          // Por ejemplo, si el recurso no se encuentra, puedes enviar un 404 al cliente
          return { error: error.response.data.error };
        } else {
          // Otras opciones de manejo de errores
          return { error: error };
        }
      }
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
      const resCoin = await client.post('/coin', { coin })
      return await resCoin.data;
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
  const resCall = await reqCall();

  console.log("/////////////////// resCall");
  console.log(resCall, call);

  //const resCall = call === 'register' ? await reqCall(res) : await reqCall();
  
  let res: { status: number; headers: { 'Content-Type': string; 'Set-Cookie'?: string } } = { 
    status: 200,
    headers: {
      'Content-Type': 'application/json', // Tipo de contenido
    }, 
  };
  
  if(resCall) {
    res.headers['Set-Cookie'] = resCall.sessionCookie; // Establecer la cookie
  }

  return NextResponse.json(resCall, res);
}