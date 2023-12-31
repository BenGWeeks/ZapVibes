import React, { useState, useEffect } from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';

const LightningWallet = () => {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/zebedee/balance`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBalance(data.data.balance);
    } catch (error) {
      console.log('There was a problem with the fetch operation: ' + error.message);
    }

    // Fetch the balance from the Zebedee API
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/zebedee/balance`, {
        headers: {
          'Content-Type': 'application/json'//,
          //'api-key': apiKey,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBalance(data.data.balance);
    } catch (error) {
      console.log('There was a problem with the fetch operation: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Lightning Wallet</h1>
      <p>Balance: {balance}</p>
      <PrimaryButton onClick={fetchBalance}>Refresh Balance</PrimaryButton>
    </div>
  );
};

export default LightningWallet;
