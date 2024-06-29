"use client"

import React, { useState } from 'react';
import { formatUnits, parseUnits } from '@ethersproject/units';

export default function WeiConverter() {
  const [weiValue, setWeiValue] = useState('');
  const [gweiValue, setGweiValue] = useState('');
  const [ethValue, setEthValue] = useState('');

  const convertToGwei = () => {
    if (weiValue === '') {
      setGweiValue('');
      setEthValue('');
      return;
    }
    try {
      const gwei = formatUnits(weiValue, 'gwei');
      setGweiValue(gwei);
      const eth = formatUnits(weiValue, 'ether');
      setEthValue(eth);
    } catch (error) {
      console.error('Error converting Wei to Gwei/Eth:', error);
    }
  };

  const convertToWei = (value, unit) => {
    try {
      const wei = parseUnits(value, unit);
      setWeiValue(wei);
      convertToGwei();
    } catch (error) {
      console.error('Error converting Gwei/Eth to Wei:', error);
    }
  };



  const handleValueChange = (event, type) => {
    const value = event.target.value;
    switch (type) {
      case 'wei':
        setWeiValue(value);
        convertToGwei();
        
        break;
      case 'gwei':
        setGweiValue(value);
        convertToWei(value, 'gwei');
        break;
      case 'eth':
        setEthValue(value);
        convertToWei(value, 'ether');
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Wei to Gwei to Eth Converter</h1>

        <div className="flex items-center mb-4">
          <label htmlFor="weiInput" className="mr-2 text-gray-700">
            Wei:
          </label>
          <input
            id="weiInput"
            type="number"
            value={weiValue}
            onChange={(e) => handleValueChange(e, 'wei')}
            className="border rounded-lg px-2 py-1 outline-none flex-grow text-gray-700"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="gweiInput" className="mr-2 text-gray-700">
            Gwei:
          </label>
          <input
            id="gweiInput"
            type="number"
            value={gweiValue}
            onChange={(e) => handleValueChange(e, 'gwei')}
            className="border rounded-lg px-2 py-1 outline-none flex-grow text-gray-700"
          />
        </div>

        <div className="flex items-center mb-4">
          <label htmlFor="ethInput" className="mr-2 text-gray-700">
            Eth:
          </label>
          <input
            id="ethInput"
            type="number"
            value={ethValue}
            onChange={(e) => handleValueChange(e, 'eth')}
            className="border rounded-lg px-2 py-1 outline-none flex-grow text-gray-700"
          />
        </div>

        {/* Add a close button if needed */}
      </div>
    </div>
  );
}
