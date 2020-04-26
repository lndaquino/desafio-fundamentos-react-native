import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://10.0.2.2:3333', // funcionou para o emulador
  baseURL: 'http://localhost:3333', // só pro emulador
  // baseURL: 'http://192.168.15.12:3333', // tanto pra conexão via usb qt para wifi tem q usar o ip da máquina
});

export default api;
