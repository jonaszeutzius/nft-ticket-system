# NFT TICKET SYSTEM

Blockspan API offers a wealth of data about NFTs. It's a treasure trove for developers who want to build applications around NFTs, whether it's for pricing, trading, analytics, or anything else you can imagine in the NFT space.

Suppose you run a concert venue and sell tickets in the form of NFTs. For someone to check in to the concert, they must have a ticket with the correct contract address in their wallet. In this guide, we will create an application that checks a persons wallet for their digital ticket. The user will hardcode a contract address and expiration date, and input a wallet address to see how many valid tickets a wallet owns. This application will use the Blockspan Get All NFTS of Owner API. 

## REQUIREMENTS:
- Node.js and npm installed on your system.
- Basic knowledge of React.js
- Blockspan API key

## STEP 1: SETTING UP THE REACT APP

First, we need to create a new React application. Open your terminal, navigate to the directory where you want to create your project, and run the following command:

`npx create-react-app nft-ticket-system`

This will create a new folder `nft-ticket-system` with all the necessary files and dependencies for a React application.

## STEP 2: INSTALL AXIOS

We'll be using Axios to make HTTP requests to the Blockspan API. Navigate into your new project folder and install Axios:

`cd nft-ticket-system` `npm install axios`

## STEP 3: CREATE A NEW COMPONENT

In the `src` directory, create a new file `NFTTicketSystem.js`. This will be our main component for the NFT Ticket System.

## STEP 4: WRITING THE COMPONENT

In `NFTTicketSystem.js`, we will import React, Axios, and App.css. Then we will set up necessary state variables such as walletAddress and blockchain. Finally, we will hard code the ticket contract address and expiration date:

```
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function NFTTicketSystem() {
  const [walletAddress, setWalletAddress] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const contract = 'INPUT_CONTRACT_ADDRESS_HERE'
  const expirationDate = '2024-01-01T01:00:00.000Z' // Sample expiration date
  const currentDate = new Date()

  // verifyTicket function

  // Additional helper functions

  return (
    // JSX code
  );
}

export default NFTTicketSystem;
```

Remeber to set the `contract` variable to a valid contract address, and that `expirationDate` is in ISO 8601 format!

## STEP 5: FETCHING AND DISPLAYING THE DATA

We will add a function `verifyTicket` to our component that makes a get request to the Blockspan API and sets `data` in our state:

```
// verifyTicket function

const verifyTicket = async () => {
    const url = `http://localhost:8080/v1/nfts/owner/${walletAddress}?chain=${blockchain}&page_size=25`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      console.log('API call 1:', response);
      const filteredResults = response.data.results.filter(
        result => result.contract_address === contract
      );
      console.log('filtered results', filteredResults) // array
      setData(filteredResults)
      setError(null);
    } catch (error) {
      console.error(error);
      setError('No tickets found on this chain in this wallet!');
      setData(null);
    }
  };
```

Don't forget to replace `YOUR_BLOCKSPAN_API_KEY` with your actual key!

We will then add two helper functions which help simplify our code:

```
// Additional helper functions

const handleBlockchainChange = event => {
setBlockchain(event.target.value);
};

const checkData = data => (data ? data : 'N/A');
```

Our JSX code will display a form for the user to select a chain and input their wallet address, and a button to initiate the verification. After the data is fetched, it will be displayed in a table:

```
// JSX code

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
            <p className="successMessage">1 ticket found in wallet!</p>
        ) : (
            <p className="successMessage">{data.length} tickets found in wallet!</p>
        )}
        {console.log(data)}
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
```

Finally, we will enhance the user interface in the browser by replacing all code in the App.css file with the following:

```
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.title {
  margin-top: 20px;
  margin-bottom: 0;
  text-align: center;
}

.errorMessage {
  text-align: center;
  color: red;
  font-weight: bold;
}

.successMessage {
  text-align: center;
  color: green;
  font-weight: bold;
}

.message {
  text-align: center;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputContainer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.inputContainer input {
  padding: 10px;
  font-size: 1em;
  width: 200px;
}

.inputContainer button {
  padding: 10px;
  font-size: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.inputContainer button:hover {
  background-color: #0056b3;
}

.imageContainer {
  display: flex;
  justify-content: center;
  width: 100%; 
}

.imageContainer img {
  width: 100%; 
  max-width: 500px;
  height: auto; 
}
.nftData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.nftData .image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nftData h2 {
  margin: 10px 0;
}

.nftData p {
  font-size: 1.2em;
  font-weight: bold;
}

td {
  padding: 10px;
  text-align: left;
}

th {
  padding: 10px;
  text-align: left;
}

.tableContainer {
  margin: 0 auto;
}
```

## STEP 6: INTEGRATING THE COMPONENT

Finally, let's integrate our `NFTTicketSystem` component into the main application. In App.js, import and use the `NFTTicketSystem` component:

```
import React from 'react';
import './App.css';
import NFTTicketSystem from './NFTTicketSystem';

function App() {
  return (
    <div className="App">
      <NFTTicketSystem />
    </div>
  );
}

export default App;

```

Now, you can start your application by running `npm start` in your terminal. You should see the following in the browser:

- A dropdown menu to select a blockchain
- Text box for wallet address
- A verify ticket button

Input the data of the chain and wallet you want to check, and click the verify ticket button. You should then see a green "X tickets found" message and a table with all tickets and their validity, or a red message if no tickets are found. 

This wraps up our guide to creating an NFT Ownership Verification tool using the Blockspan API and React.js. Happy coding!

## CONCLUSION

Congratulations! You've just built a simple yet powerful NFT ticket verification tool using the Blockspan API and React.js. As you've seen, the Blockspan API is intuitive to use and provides detailed and accurate information, making it a perfect choice for this kind of application. This tutorial is just a starting point - there are many ways you can expand and improve your tool. For example, you could add more error checking, improve the UI, or add support for more blockchains.

As the world of NFTs continues to grow and evolve, tools like this will become increasingly important. Whether you're an NFT enthusiast, a developer, or a startup, understanding NFTs is a valuable skill. We hope you found this tutorial helpful.