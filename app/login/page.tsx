// api/login/page.tsx
'use client'

import { useState } from 'react';
import { Card, Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  // Crea una instancia de Axios con la configuración de credenciales
  const axiosInstance = axios.create({
    withCredentials: true,
    // Asegúrate de que la URL base sea correcta y permita credenciales
    baseURL: '/'
  });

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  const [isLogin, setIsLogin] = useState(true);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleApiSecretChange = (event) => {
    setApiSecret(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/api/login', { username, password });
      if (response.status === 200) {
        localStorage.setItem('userId', response.data.userData.userId);
        console.log('response.data', response.data);
        
        const userOrderStringify = response.data.userData.userOrder;
        const userOrder = JSON.parse(userOrderStringify);

        if(userOrder.schedule) {
          localStorage.setItem('userOrder', userOrderStringify);
          localStorage.setItem('isAutoSaleEnabled', JSON.stringify(true));
          localStorage.setItem('earnAmount', JSON.stringify(userOrder.schedule.earnAmount));
          localStorage.setItem('loseAmount', JSON.stringify(userOrder.schedule.loseAmount));
          localStorage.setItem('reSaleTime', JSON.stringify(userOrder.schedule.reSaleTime));
        }
        router.push('/');
      } else {
        // Manejar errores de inicio de sesión aquí
      }
    } catch (error) {
      console.error(error);
      // Manejar errores de red aquí
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/api/register', { username, password, apiKey, apiSecret });
      if (response.status === 200) {
        localStorage.setItem('userId', response.data.userData.userId);
        localStorage.setItem('userOrder', response.data.userData.userOrder);
        //localStorage.setItem('authToken', response.data.userData.authToken);
        router.push('/');
      } else {
        // Manejar errores de registro aquí
      }
    } catch (error) {
      console.error(error);
      // Manejar errores de red aquí
    }
  };

  return (
    <Card className="max-w-md">
      <p>{ isLogin ? "Ingreso" : "Registro con Binance" }</p>
      <form className="flex flex-col gap-8">
        { !isLogin && (
          <>
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
                value={apiSecret}
                onChange={handleApiSecretChange}
              />
            </div>
          </>
        )}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Nombre de usuario" />
          </div>
          <TextInput
            id="username"
            required
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Contraseña" />
          </div>
          <TextInput
            id="password"
            required
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div> */}
        { isLogin && (
          <Button type="submit" onClick={handleLogin}>
            Ingresar
          </Button>
        )}
        { !isLogin && (
          <Button type="button" onClick={handleRegister}>
            Registrarse
          </Button>
        )}
        { isLogin && (
          <Button color="gray" type="button" onClick={()=>{ setIsLogin(false) }}>
            Nuevo usuario
          </Button>
        )}
      </form>
    </Card>
  );
}
