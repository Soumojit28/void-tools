"use client"
import '../globals.css';
import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [abi, setAbi] = useState('');
  const [structs, setStructs] = useState([]);
  const [selectedStruct, setSelectedStruct] = useState('');
  const [variables, setVariables] = useState([]);
  const [values, setValues] = useState({});
  const [output, setOutput] = useState([]);
  
  const [domainName, setDomainName] = useState('');
  const [domainVersion, setDomainVersion] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [chainId, setChainId] = useState('');

  const [activeTab, setActiveTab] = useState('abi'); // 'abi' or 'manual'

  const parseAbi = (abiString) => {
    try {
      const abiJson = JSON.parse(abiString);
      const structs = [];
      const structNames = new Set();
      
      abiJson.forEach(item => {
        if (item.inputs) {
          item.inputs.forEach(input => {
            if (input.internalType && input.internalType.startsWith('struct')) {
              const structName = input.internalType.split(' ')[1];
              if (!structNames.has(structName)) {
                structNames.add(structName);
                const fields = input.components.map(component => ({
                  name: component.name,
                  type: component.type
                }));
                structs.push({ name: structName === 'KDropSigner.Signature' ? 'Signature' : structName, fields });
              }
            }
          });
        }
        if (item.outputs) {
          item.outputs.forEach(output => {
            if (output.internalType && output.internalType.startsWith('struct')) {
              const structName = output.internalType.split(' ')[1];
              if (!structNames.has(structName)) {
                structNames.add(structName);
                const fields = output.components.map(component => ({
                  name: component.name,
                  type: component.type
                }));
                structs.push({ name: structName === 'KDropSigner.Signature' ? 'Signature' : structName, fields });
              }
            }
          });
        }
      });

      setStructs(structs);
    } catch (error) {
      console.error('Invalid ABI', error);
    }
  };

  const handleStructChange = (structName) => {
    const struct = structs.find(s => s.name === structName);
    if (struct) {
      setSelectedStruct(structName);
      setVariables(struct.fields.filter(field => field.name !== 'signature'));
      setValues({});
    }
  };

  const handleValueChange = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const handleSign = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const domain = {
        name: domainName,
        version: domainVersion,
        chainId: chainId ? parseInt(chainId) : await signer.getChainId(),
        verifyingContract: contractAddress
      };

      const types = {
        [selectedStruct]: variables.map(variable => ({ name: variable.name, type: variable.type }))
      };

      const value = {};
      variables.forEach(variable => {
        value[variable.name] = values[variable.name];
      });

      const signature = await signer._signTypedData(domain, types, value);
      console.log('Domain:', domain);
      console.log('Types:', types);
      console.log('Value:', value);
      console.log('Signature:', signature);
      const outputArray = variables.map(variable => values[variable.name]);
      outputArray.push(signature);
      console.log('Output:', outputArray);

      setOutput(outputArray);
    } else {
      console.error('Metamask not found');
    }
  };

  const handleAddVariable = () => {
    setVariables([...variables, { name: '', type: '' }]);
  };

  const handleRemoveVariable = (index) => {
    const newVariables = [...variables];
    newVariables.splice(index, 1);
    setVariables(newVariables);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">ERC721 Signature Tool</h1>
        <div className="mb-4">
          <button onClick={() => setActiveTab('abi')} className={`py-2 px-4 rounded-l ${activeTab === 'abi' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            ABI Entry
          </button>
          <button onClick={() => setActiveTab('manual')} className={`py-2 px-4 rounded-r ${activeTab === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            Manual Entry
          </button>
        </div>
        
        {activeTab === 'abi' && (
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">ABI:</label>
              <textarea 
                value={abi} 
                onChange={(e) => setAbi(e.target.value)} 
                className="mt-1 p-2 w-full border border-gray-300 rounded" 
                rows="4"
              />
              <button type="button" onClick={() => parseAbi(abi)} className="bg-blue-500 text-white py-2 px-4 rounded mt-2">Parse ABI</button>
            </div>
            {structs.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700">Select Struct:</label>
                <select 
                  value={selectedStruct} 
                  onChange={(e) => handleStructChange(e.target.value)} 
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                >
                  <option value="">Select a struct</option>
                  {structs.map((struct) => (
                    <option key={struct.name} value={struct.name}>{struct.name}</option>
                  ))}
                </select>
              </div>
            )}
            {variables.map((variable, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder="Variable Name"
                  value={variable.name}
                  readOnly
                  className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-200"
                />
                <input
                  type="text"
                  placeholder="Data Type"
                  value={variable.type}
                  readOnly
                  className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-200"
                />
                <input
                  type="text"
                  placeholder={`Value for ${variable.name}`}
                  onChange={(e) => handleValueChange(variable.name, e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-gray-700">Domain Data:</label>
              <input
                type="text"
                placeholder="Domain Name"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Domain Version"
                value={domainVersion}
                onChange={(e) => setDomainVersion(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Contract Address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Chain ID"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={handleSign} className="bg-green-500 text-white py-2 px-4 rounded">Sign</button>
            </div>
          </form>
        )}
        
        {activeTab === 'manual' && (
          <form>
            <div className="mb-4 text-gray-700">
              <label className="block text-gray-700">Struct Name:</label>
              <input
                type="text"
                value={selectedStruct}
                onChange={(e) => setSelectedStruct(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            {variables.map((variable, index) => (
              <div key={index} className="mb-4 text-gray-800">
                <input
                  type="text"
                  placeholder="Variable Name"
                  value={variable.name}
                  onChange={(e) => {
                    const newVariables = [...variables];
                    newVariables[index].name = e.target.value;
                    setVariables(newVariables);
                  }}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Data Type"
                  value={variable.type}
                  onChange={(e) => {
                    const newVariables = [...variables];
                    newVariables[index].type = e.target.value;
                    setVariables(newVariables);
                  }}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder={`Value for ${variable.name}`}
                  onChange={(e) => handleValueChange(variable.name, e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
                <button type="button" onClick={() => handleRemoveVariable(index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Remove</button>
              </div>
            ))}
            <div className="mb-4 text-gray-600">
              <label className="block text-gray-700">Domain Data:</label>
              <input
                type="text"
                placeholder="Domain Name"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Domain Version"
                value={domainVersion}
                onChange={(e) => setDomainVersion(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Contract Address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Chain ID"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={handleSign} className="bg-green-500 text-white py-2 px-4 rounded">Sign</button>
              <button type="button" onClick={handleAddVariable} className="bg-blue-500 text-white py-2 px-4 rounded">Add Variable</button>
            </div>
          </form>
        )}
        
        {output.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-gray-600">
            <h2 className="text-gray-700 font-bold">Output:</h2>
            <pre className="break-words whitespace-pre-wrap">{JSON.stringify(output)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
