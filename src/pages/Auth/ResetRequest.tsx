import { useState } from 'react';

export default function ResetRequest() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email) return alert('Email is required');
    if (!username) return alert('Username is required');

    try {
     const res = await fetch('http://localhost:3000/auth/forgot-password', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email })
        });
        

      const data = await res.json();
      console.log(data);  
      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.message || 'An error occurred');
      }
    } catch (error) {
      alert('Failed to send request');
    }
  };

  return (
    <form className='mt-36' onSubmit={handleResetRequest}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Request Password Reset</button>
    </form>
  );
}
