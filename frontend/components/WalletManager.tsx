'use client';

import { useState } from 'react';
import { ethers, Wallet } from 'ethers';


// Define types for our wallet data
interface WalletData {
  address: string;
  privateKey: string;
  mnemonic: string;
  balance: string;
  derivationPath?: string;
}

// Define types for component props
interface ImportWalletProps {
  onImportPrivateKey: (key: string) => void;
  onImportMnemonic: (phrase: string) => void;
}

interface WalletDisplayProps {
  wallet: WalletData;
  onClear: () => void;
  onCopy: (text: string) => void;
}

export default function WalletManager() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const createNewWallet = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create a new random wallet
      const newWallet = Wallet.createRandom();
      
      // Get balance (will be 0 for new wallet)
      const balance = '0';
      
      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic?.phrase || '',
        balance
      });
    } catch (err) {
      setError('Failed to create wallet: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const importFromPrivateKey = (privateKey: string) => {
    try {
      const wallet = new Wallet(privateKey);
      setWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: '',
        balance: '0'
      });
      setError('');
    } catch (err) {
      setError('Invalid private key: ' + (err as Error).message);
    }
  };

  const importFromMnemonic = (mnemonic: string) => {
    try {
      const wallet = Wallet.fromPhrase(mnemonic);
      setWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase || mnemonic,
        balance: '0'
      });
      setError('');
    } catch (err) {
      setError('Invalid mnemonic phrase: ' + (err as Error).message);
    }
  };

  const clearWallet = () => {
    setWallet(null);
    setError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">EVM Wallet Generator</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!wallet ? (
        <div className="space-y-4">
          <button
            onClick={createNewWallet}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create New Wallet'}
          </button>

          <ImportWallet 
            onImportPrivateKey={importFromPrivateKey}
            onImportMnemonic={importFromMnemonic}
          />
        </div>
      ) : (
        <WalletDisplay 
          wallet={wallet} 
          onClear={clearWallet}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
}

function ImportWallet({ onImportPrivateKey, onImportMnemonic }: ImportWalletProps) {
  const [showImport, setShowImport] = useState(false);
  const [importType, setImportType] = useState<'privateKey' | 'mnemonic'>('privateKey');
  const [importValue, setImportValue] = useState('');

  const handleImport = () => {
    if (importType === 'privateKey') {
      onImportPrivateKey(importValue);
    } else {
      onImportMnemonic(importValue);
    }
    setImportValue('');
  };

  return (
    <div className="border-t pt-4 mt-4">
      <button
        onClick={() => setShowImport(!showImport)}
        className="text-blue-500 hover:text-blue-700"
      >
        {showImport ? 'Hide Import Options' : 'Import Existing Wallet'}
      </button>

      {showImport && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="mb-4">
            <label className="block mb-2">
              Import from:
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as 'privateKey' | 'mnemonic')}
                className="ml-2 p-1 border rounded"
              >
                <option value="privateKey">Private Key</option>
                <option value="mnemonic">Mnemonic Phrase</option>
              </select>
            </label>
          </div>

          <div className="mb-4">
            <textarea
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              placeholder={importType === 'privateKey' ? 'Enter private key' : 'Enter mnemonic phrase'}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <button
            onClick={handleImport}
            disabled={!importValue.trim()}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Import Wallet
          </button>
        </div>
      )}
    </div>
  );
}

function WalletDisplay({ wallet, onClear, onCopy }: WalletDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Wallet</h2>
        <button
          onClick={onClear}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
        >
          Clear
        </button>
      </div>

      <div className="space-y-4">
        {/* Public Address with QR Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Public Address
          </label>
          <div className="flex items-center gap-4">
            <code className="bg-gray-100 p-2 rounded flex-1">
              {wallet.address}
            </code>
            <button
              onClick={() => onCopy(wallet.address)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              Copy
            </button>
          </div>
          <div className="mt-3 flex justify-center">
            {/* <QRCode value={wallet.address} size={128} /> */}
          </div>
        </div>

        {/* Private Key */}
        <div>
<p>{wallet.address}</p>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Private Key (Keep this secure!)
          </label>
          <div className="flex items-center">
            <code className="bg-gray-100 p-2 rounded flex-1">
              {wallet.privateKey}
            </code>
            <button
              onClick={() => onCopy(wallet.privateKey)}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Mnemonic Phrase */}
        {wallet.mnemonic && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mnemonic Phrase (Keep this secure!)
            </label>
            <div className="flex items-center">
              <code className="bg-gray-100 p-2 rounded flex-1">
                {wallet.mnemonic}
              </code>
              <button
                onClick={() => onCopy(wallet.mnemonic)}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balance
          </label>
          <code className="bg-gray-100 p-2 rounded">
            {wallet.balance} ETH
          </code>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <strong className="text-yellow-800">⚠️ Security Warning:</strong>
        <p className="text-yellow-700 text-sm mt-1">
          Never share your private key or mnemonic phrase. Anyone with access to these can control your funds.
          This is a demonstration app - for real use, consider using hardware wallets or established wallet software.
        </p>
      </div>
    </div>
  );
}
