import Binance from 'binance-api-node'
import { NextResponse } from 'next/server'

const coins = ['USDT', 'BTC', 'ETH']

export async function POST(request: Request, { params }: { params: { call: string } }) {
  const req = await request.json()
  const { call } = params;
  // Obtener la sesión del usuario
  //const session = useSession()
  const session = { apiKey: process.env.KEY, secretKey: process.env.SECRET }
  // Crear un cliente autenticado con la clave API y la clave secreta del usuario
  //const session = req.session
  const coin = req.coin ?? ''
  const amount = req.amount ?? ''
  const client = Binance({ apiKey: session.apiKey, apiSecret: session.secretKey })

  const ip = request.headers.get('x-real-ip')
  console.log(`La dirección IP de la solicitud es ${ip}`)

  const calls = {
    balance: async () => {
      // Obtener el balance del usuario
      const balance = await client.accountInfo()
      const assets = balance.balances.filter(asset => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0)
      // Obtener el precio actual del dólar
      //const dollarPrice = 0 //await client.futuresPrices({ symbol: 'USDTUSDT' })
      // Calcular el balance total en dólares
      let totalBalance = 0
      //console.log('assets', assets )
      for (let asset of assets) {
        //coins.map(async (coin) => {
          //if(asset.asset == coin) {
            // Obtener el precio del activo en USDT
            //console.log('asset.asset', asset.asset)
            try {
              let assetBalance = 0
              console.log(asset)
              if(asset.asset != 'USDT') {
                const assetPrice = await client.prices({ symbol: asset.asset + 'USDT' })
                
                //console.log('assetPrice', assetPrice[asset.asset + 'USDT'])
                // Convertir el balance del activo en USDT
                assetBalance = parseFloat(asset.free) + parseFloat(asset.locked) * parseFloat(assetPrice[asset.asset + 'USDT'])
                // Sumar al balance total en dólares
              } else {
                assetBalance = parseFloat(asset.free) + parseFloat(asset.locked)
              }
              const price = asset.asset != 'USDT' ? await client.avgPrice({ symbol: asset.asset + 'USDT' }) : { price: 1 }
              totalBalance += assetBalance * price.price //* parseFloat(dollarPrice.price)
            } catch (error) {
              //console.log(error)
            }
         // }
        //})
      }
      // Mostrar el balance total en la interfaz
      return totalBalance;
    },
    balances: async () => {
      // Obtener el balance del usuario
      const balances = await client.accountInfo()
      const assets = balances.balances.filter(asset => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0)
      
      // Crear un array de objetos con el asset, el balance y el balance en USDT
      const balancesInUSDT = await Promise.all(assets.map(async asset => {
        // Obtener el precio de la moneda en USDT
        const price = asset.asset != 'USDT' ? await client.avgPrice({ symbol: asset.asset + 'USDT' }) : { price: 1 }
        
        // Calcular el balance en USDT
        const balanceInUSDT = (parseFloat(asset.free) + parseFloat(asset.locked)) * parseFloat(price.price) || 0

        console.log('#balanceInUSDT', balanceInUSDT)

        // Devolver el objeto con el asset, el balance y el balance en USDT
        return {
          asset: asset.asset,
          balance: parseFloat(asset.free) + parseFloat(asset.locked),
          balanceInUSDT: balanceInUSDT.toFixed(2)
        }
      }))
      
      // Mostrar el balance en la interfaz
      return balancesInUSDT;
    },    
    balanceOf: async () => {
      // Obtener el balance del usuario
      const balances = await client.accountInfo()
      const assets = balances.balances.filter(asset => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0)
      
      // Buscar el asset que tenga el mismo asset.asset que coin
      const asset = assets.find(asset => asset.asset === coin)
      
      // Devolver la suma de asset.free y asset.locked
      const balance = asset ? parseFloat(asset.free) + parseFloat(asset.locked) : 0
      
      // Obtener el precio de la moneda en USDT
      const price = coin != 'USDT' ? await client.avgPrice({ symbol: coin + 'USDT' }) : { price: 1 }
      
      console.log('balance', balance, price)
      console.log((balance * parseFloat(price.price)).toFixed(2))
      // Devolver el balance convertido a USDT
      return (balance * parseFloat(price.price)).toFixed(2)
    },    
    available: async () => {
      // Obtener el balance del usuario
      const balance = await client.accountInfo()
      // Buscar el activo que corresponde a la moneda
      const asset = balance.balances.find(asset => asset.asset === coin)
      console.log('//AA', asset);
      // Si no se encuentra el activo, retornar cero
      if (!asset) return 0
      // Si se encuentra el activo, sumar el saldo libre y el saldo bloqueado
      const free = parseFloat(asset.free)
      const locked = parseFloat(asset.locked)
      const total = free + locked
      // Retornar el total
      return total.toFixed(2)
    },
    buy: async (coin, amount) => {
      console.log('session', session)
      console.clear()
      // Comprar una moneda
      const order = await client.order({
        symbol: coin + 'USDT',
        side: 'BUY',
        quantity: amount,
        type: 'MARKET'
      })
      console.log('order', order)
      return order;
    },
    sell: async (coin, amount) => {
      // Vender una moneda
      const order = await client.order({
        symbol: coin + 'USDT',
        side: 'SELL',
        quantity: amount,
        type: 'MARKET'
      })
      console.log('order', order)
      return order;
    },
    coins: async () => {
      // Definir las monedas que quieres consultar
      const coins = ['BTC', 'ETH']
    
      // Obtener los precios de mercado de todos los pares
      const prices = await client.prices()
    
      // Obtener los precios de mercado de cada moneda en USDT
      const pricesObjects = coins.map(coin => {
        const pair = coin + 'USDT'
        const price = coin != 'USDT' ?parseFloat(prices[pair]).toFixed(2) : 1
        return {coin, price}
      })
    
      // Devolver los precios como un array
      console.log('pricesObjects', pricesObjects)
      return pricesObjects;
    },    
    coin: async () => {
      // Obtener el valor y los datos de una moneda específica}
      console.log('route.ts: coin', coin)
      let price = 0
      if(coin != 'USDT') {
        const exchange = await client.prices({symbol: coin + 'USDT'})
        price = parseFloat(exchange[coin + 'USDT']).toFixed(2)
        //const exchangeInfo = await client.exchangeInfo()
        //const coinInfo = exchangeInfo.symbols.find(symbol => symbol.baseAsset === coin)
      } else {
        price = 1
      }
      return price//, coinInfo};
    }
  }

  const reqCall = calls[call];
  const res = amount != '' ? await reqCall(coin, amount) : await reqCall();
  
  return NextResponse.json(res, { status: 200 })
  /*return (
    <div>
      <h1>Balance</h1>
      <ul>
        {assets.map(asset => (
          <li key={asset.asset}>{asset.asset}: {parseFloat(asset.unrealizedProfit) + parseFloat(asset.walletBalance)}</li>
        ))}
      </ul>
    </div>
  )*/
}
