'use client'

import { useState } from 'react';
import { Card, Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSecretKeyChange = (event) => {
    setSecretKey(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault()
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('secretKey', secretKey);
    router.push('/')
  };

  return (
    <Card className="max-w-md">
      <p>Ingreso con Binance</p>
      <form className="flex flex-col gap-8">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="api-key" value="Tu API Key" />
          </div>
          <TextInput
            id="user-key"
            placeholder=""
            required
            type="text"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="secret-key" value="Tu Secret Key" />
          </div>
          <TextInput
            id="secret-key"
            required
            type="password"
            value={secretKey}
            onChange={handleSecretKeyChange}
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div> */}
        <Button type="submit" onClick={handleLogin}>
          Ingresar
        </Button>
      </form>
    </Card>
  );
}
