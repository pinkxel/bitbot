// app/dashboard/settings/page.server.js
import Binance from 'binance-api-node'
//import { useSession } from "next-auth/react"

export default async function SettingsPage() {
  // Obtener la sesión del usuario
  //const session = useSession()
  const session = { apiKey: process.env.KEY, apiSecret: process.env.SECRET }
  // Crear un cliente autenticado con la clave API y la clave secreta del usuario
  const client = Binance({ apiKey: session.apiKey, apiSecret: session.apiSecret })
  // Obtener el balance del usuario
  const balance = await client.accountInfo()
  // Mostrar el balance en la interfaz
  return (
    <div>
      <h1>Balance</h1>
      <ul>
        {balance.balances.map(asset => (
          <li key={asset.asset}>{asset.asset}: {asset.free}</li>
        ))}
      </ul>
    </div>
  )
}
