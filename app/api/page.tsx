import Binance from 'binance-api-node'
//import { useSession } from "next-auth/react"

export default async function SettingsPage() {
  // Obtener la sesión del usuario
  //const session = useSession()
  const session = { apiKey: process.env.KEY, apiSecret: process.env.SECRET }
  // Crear un cliente autenticado con la clave API y la clave secreta del usuario
  const client = Binance({ apiKey: session.apiKey, apiSecret: session.apiSecret })
  // Obtener el balance del usuario
  const balance = await client.futuresAccountInfo()
  const assets = balance.assets.filter(asset => parseFloat(asset.walletBalance) > 0)
  //const assets = balance.balances//.filter(asset => parseFloat(asset.free) > 0)
  // Mostrar el balance en la interfaz
  return (
    <div>
      <h1>Balance</h1>
      <ul>
        {assets.map(asset => (
          <li key={asset.asset}>{asset.asset}: {parseFloat(asset.unrealizedProfit) + parseFloat(asset.walletBalance)}</li>
        ))}
      </ul>
    </div>
  )
}
