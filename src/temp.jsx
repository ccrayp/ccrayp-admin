import { useNavigate } from 'react-router-dom'
import {expire_token, removeJWTToken} from './utilities';

function App() {

  const navigate = useNavigate()

  async function check() {
    const token = localStorage.getItem('jwt_token');
    const outputElement = document.getElementById('check-text');

    if (!token) {
      outputElement.textContent = 'No token found. Please login first.';
      outputElement.style.color = 'red';
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      expire_token(response)

      if (!response.ok) {
        const errorData = await response.json();
      }

      const data = await response.json();
      
      outputElement.textContent = JSON.stringify(data);
      outputElement.style.color = 'green';
      
    } catch (error) {
      console.error('Error:', error);
      outputElement.textContent = `Error: ${error.message}`;
      outputElement.style.color = 'red';
    }
  }

  return (
    <>
      <h1>Панель андминистратора</h1>
      <form>
        <div>
          <label htmlFor="username">Username: </label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password: </label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required
          />
        </div>
      </form>
      <button onClick={() => login()}>Login</button>
      <div>
        <button onClick={() => check()}>Проверка</button>
        <h5 id='check-text'></h5>
      </div>
    </>
  )
}