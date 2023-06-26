import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function NFTTicketSystem() {
  const [walletAddress, setWalletAddress] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = 'HARD_CODED_TICKET_CONTRACT_ADDRESS'
  const expirationDate = '2023-01-01T01:00:00.000Z'
  const currentDate = new Date()

  const verifyTicket = async () => {
    const url = `https://api.blockspan.com/v1/nfts/owner/${walletAddress}?chain=${blockchain}&page_size=25`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      const filteredResults = response.data.results.filter(
        result => result.contract_address === contractAddress
      );
      setData(filteredResults)
      setError(null);
    } catch (error) {
      console.error(error);
      setError('No tickets found on this chain in this wallet!');
      setData(null);
    }
  };

  const handleBlockchainChange = event => {
    setBlockchain(event.target.value);
  };

  const checkData = data => (data ? data : 'N/A');

  return (
    <div>
      <h1 className="title">NFT Ticket System</h1>
      <p className="message">
        Select a blockchain and input a wallet address to check how many tickets that wallet owns on that chain.
      </p>
      <div className="inputContainer">
        <select name="blockchain" value={blockchain} onChange={handleBlockchainChange}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <input type="text" placeholder="Wallet Address" onChange={e => setWalletAddress(e.target.value)} />
        <button onClick={verifyTicket}>Verify Ticket</button>
      </div>
      {error && <p className="errorMessage">{error}</p>}
      {data !== null && data.length === 0 && (
        <p className="errorMessage">No tickets found on this chain in this wallet!</p>
      )}
      {data !== null && data.length > 0 && (
        <div>
            {data.length === 1 ? (
              Date.parse(currentDate) < Date.parse(expirationDate) ? (
                <p className="successMessage">1 ticket found in wallet!</p>
              ) : (
                <p className="errorMessage">1 expired ticket found in wallet!</p>
              )
            ) : (
              Date.parse(currentDate) < Date.parse(expirationDate) ? (
                <p className="successMessage">{data.length} tickets found in wallet!</p>
              ) : (
                <p className="errorMessage">{data.length} expired tickets found in wallet!</p>
              )
            )}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <h2>Details:</h2>
          </div>
          <table className='tableContainer'>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Ticket Number</th>
                <th>Token ID</th>
                <th>Token Type</th>
                <th>Minted At</th>
                <th>Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((result, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                  <td>{index + 1}</td>
                  <td>{checkData(result.id)}</td>
                  <td>{checkData(result.token_type)}</td>
                  <td>{checkData(result.minted_at)}</td>
                    {Date.parse(currentDate) < Date.parse(expirationDate) ? (
                      <td className='successMessage'>{`VALID -- ${new Date(expirationDate).toLocaleString()}`}</td>
                    ) : (
                      <td className='errorMessage'>{`EXPIRED -- ${new Date(expirationDate).toLocaleString()}`}</td>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NFTTicketSystem;
