import Binance from 'binance-api-node'
import { NextResponse } from 'next/server'

const coins = ['USDT', 'BTC', 'ETH']

export async function POST(request: Request, { params }: { params: { call: string } }) {
  const req = await request.json()
  const { call } = params;
  // Obtener la sesión del usuario
  //const session = useSession()
  //const session = { apiKey: process.env.KEY, apiSecret: process.env.SECRET }
  // Crear un cliente autenticado con la clave API y la clave secreta del usuario
  const session = req.session
  const coin = req.coin ?? ''
  const amount = req.amount ?? ''
  const client = Binance({ apiKey: session.apiKey, apiSecret: session.secretKey })

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
              if(asset.asset != 'USDT') {
                const assetPrice = await client.prices({ symbol: asset.asset + 'USDT' })
                
                //console.log('assetPrice', assetPrice[asset.asset + 'USDT'])
                // Convertir el balance del activo en USDT
                assetBalance = parseFloat(asset.free) + parseFloat(asset.locked) * parseFloat(assetPrice[asset.asset + 'USDT'])
                // Sumar al balance total en dólares
              } else {
                assetBalance = parseFloat(asset.free) + parseFloat(asset.locked)
              }
              totalBalance += assetBalance //* parseFloat(dollarPrice.price)
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
      // Mostrar el balance en la interfaz
      return assets;
    },
    balanceOf: async () => {
      // Obtener el balance del usuario
      const balances = await client.accountInfo()
      const assets = balances.balances.filter(asset => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0)
      // Buscar el asset que tenga el mismo asset.asset que coin
      
      const asset = assets.find(asset => asset.asset === coin)
      console.log('assets',assets)
      console.log('coin',coin)
      
      // Devolver la suma de asset.free y asset.locked
      return parseFloat(asset.free) + parseFloat(asset.locked)
    },
    buy: async (coin, amount) => {
      // Comprar una moneda
      const order = await client.order({
        symbol: coin,
        side: 'BUY',
        quantity: amount,
        type: 'MARKET'
      })
      return order;
    },
    sell: async (coin, amount) => {
      // Vender una moneda
      const order = await client.order({
        symbol: coin,
        side: 'SELL',
        quantity: amount,
        type: 'MARKET'
      })
      return order;
    },
    coins: async () => {
      // Mostrar las monedas disponibles
      const exchangeInfo = await client.exchangeInfo()
      const coins = exchangeInfo.symbols.map(symbol => symbol.baseAsset)
      return coins;
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
