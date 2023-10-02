import React, { useRef, FC, useState } from 'react';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString } from "scrypt-ts";
import { Helloworld02 } from "./contracts/helloworld02";

import  DeployACT from "./DeployACT";
import  DeployACT02 from "./DeployACT02";
import  DeployACT03 from "./DeployACT03";

import Home from './Home';
import {homepvtKey} from './Home';
import TodoList from './TodoList';
import Page01TX from './Page01TX';
import Page02Write from './Page02Write';
import Page03Read from './Page03Read';
import Page04UtxoL from './Page04UtxoL';
import Page05P2PKC from './Page05P2PKC';
import Page06P2PK2P2PK from './Page06P2PK2P2PK';
import Page07p2pk2p2pkh from './Page07p2pk2p2pkh';
import Page08TXDidactic from './Page08TXDidactic';
import Page09SigForge from './Page09SigForge';
import Page10Sig2QA from './Page10Sig2QA';
import Page11SigVerify from './Page11SigVerify';



import TodoList02 from './TodoList02';
import { pvtkey } from './globals';


const provider = new DefaultProvider({network: bsv.Networks.testnet});
let Alice: TestWallet
let signerExt: TestWallet
const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)   

function App() {
//const App: FC = () => {  

//const [currentPage, setCurrentPage] = useState<string>('home');

//const handlePageChange = (page: string) => {
//  setCurrentPage(page);
//};

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showHomeDropdown, setShowHomeDropdown] = useState<boolean>(false);
  const [showTodoDropdown, setShowTodoDropdown] = useState<boolean>(false);
  const [showHWDropdown, setShowHWDropdown] = useState<boolean>(false);
  const [showSCDropdown, setShowSCDropdown] = useState<boolean>(false);
  const [showContDropdown, setShowContDropdown] = useState<boolean>(false);
  const [showUTXODropdown, setShowUTXODropdown] = useState<boolean>(false);
  const [showP2PKCDropdown, setShowP2PKCDropdown] = useState<boolean>(false);
  const [showP2PK2P2PKDropdown, setShowP2PK2P2PKDropdown] = useState<boolean>(false);
  const [showSendDropdown, setShowSendDropdown] = useState<boolean>(false);
  const [showDataDropdown, setShowDataDropdown] = useState<boolean>(false);
  const [showDTRDropdown, setShowDTRDropdown] = useState<boolean>(false);
  const [showDTDDropdown, setShowDTDDropdown] = useState<boolean>(false);
  const [showDdtcDropdown, setShowDdtcDropdown] = useState<boolean>(false);



  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setShowHomeDropdown(false);
    setShowTodoDropdown(false);
    setShowHWDropdown(false);
    setShowSCDropdown(false);
    setShowContDropdown(false);
    setShowUTXODropdown(false);
    setShowP2PKCDropdown(false);
    setShowP2PK2P2PKDropdown(false);
    setShowSendDropdown(false);
    setShowDataDropdown(false);
    setShowDTRDropdown(false);
    setShowDTDDropdown(false);
    setShowDdtcDropdown(false);
  };


  const deploy = async (amount: any) => {

    Alice = new TestWallet(privateKey, provider)

    try {

      const signer = Alice
      const message = toByteString('hello world', true)
      const instance = new Helloworld02(sha256(message))
      //const instance = new Helloworld02(0n)
      
      await instance.connect(signer);
          
      const deployTx = await instance.deploy(100)
      console.log('Helloworld contract deployed: ', deployTx.id)
      alert('deployed: ' + deployTx.id)

    } catch (e) {
      console.error('deploy HelloWorld failes', e)
      alert('deploy HelloWorld failes')
    }
  };


  const interact = async (amount: any) => {

    Alice = new TestWallet(privateKey, provider)

    try {

      const signer = Alice
      const message = toByteString('hello world', true)
      let tx = new bsv.Transaction
      tx = await provider.getTransaction(txid.current.value)
  
      console.log('Current State TXID: ', tx.id)

      const instance = Helloworld02.fromTx(tx, 0) 
      await instance.connect(signer)
  
      const { tx: callTx } = await instance.methods.unlock(message)
      console.log('Helloworld contract `unlock` called: ', callTx.id)
      alert('unlock: ' + callTx.id)
  
    } catch (e) {
      console.error('deploy HelloWorld failes', e)
      alert('deploy HelloWorld failes')
    }
  };

  const txid = useRef<any>(null);

  return (


        <div className="App">

            <nav className="navbar">
              <div className="dropdown">
                <button className="button" 
                    onClick={() => {setShowSendDropdown(false); setShowHWDropdown(false);setShowHomeDropdown(!showHomeDropdown); setShowTodoDropdown(false);setShowSCDropdown(false)}}>
                  Home
                </button>
                {showHomeDropdown && (
                  <div className="dropdown-content">
                    <button className="dropdown-button" onClick={() => handlePageChange('home')}>
                      Access Setup
                    </button>


                    <button className="dropdown-button" 
                          onClick={() => {setShowDdtcDropdown(!showDdtcDropdown); setShowSendDropdown(false) }}>
                        Didactic
                    </button>
                      {showDdtcDropdown && (
                        <div className="button">
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home09')}>
                            preimage
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home10')}>
                            ecdsa forgery
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home11')}>
                            ecdsa-pbk
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home12')}>
                            ecdsa verify
                          </button>
                        </div>
                    )}



                    <button className="dropdown-button" 
                          onClick={() => {setShowSendDropdown(!showSendDropdown); setShowDdtcDropdown(false) }}>
                        Send Satoshis
                    </button>
                      {showSendDropdown && (
                        <div className="button">
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home02')}>
                            p2pkh-p2pkh
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home06')}>
                            p2pkh-p2pk
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home07')}>
                            p2pk-p2pk
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home07')}>
                            p2pk-p2pkh
                          </button>
                        </div>
                    )}

                  </div>
                )}
              </div>

              <div className="dropdown">
                <button className="button" 
                    onClick={() => {setShowSendDropdown(false); setShowHWDropdown(false); setShowTodoDropdown(!showTodoDropdown); setShowHomeDropdown(false); setShowSCDropdown(false)}}>
                  Satoshi to Peer
                </button>
                {showTodoDropdown && (
                  <div className="dropdown-content">

                      <button className="dropdown-button" 
                          onClick={() => {setShowSendDropdown(!showSendDropdown); setShowDTDDropdown(false); setShowDataDropdown(false); setShowDTRDropdown(false) }}>
                        Send Satoshis
                      </button>
                      {showSendDropdown && (
                        <div className="button">
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home02')}>
                            p2pkh-p2pkh
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home06')}>
                            p2pkh-p2pk
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home07')}>
                            p2pk-p2pk
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home08')}>
                            p2pk-p2pkh
                          </button>
                        </div>
                      )}

                      <button className="dropdown-button" 
                          onClick={() => {setShowDataDropdown(!showDataDropdown); setShowDTDDropdown(false); setShowSendDropdown(false); setShowDTRDropdown(false) }}>
                        Data on Chain
                      </button>
                      {showDataDropdown && (
                        <div className="button">

                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home03')}>
                            Write Data
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('home04')}>
                            Retrieve Data
                          </button>

                        </div>
                      )}

                      <button className="dropdown-button" 
                          onClick={() => {setShowDTRDropdown(!showDTRDropdown); setShowDTDDropdown(false); setShowSendDropdown(false); setShowDataDropdown(false) }}>
                        Data Token R
                      </button>
                      {showDTRDropdown && (
                        <div className="button">

                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Create
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Reshape
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Transfer
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Melt
                          </button>

                        </div>
                      )}

                      <button className="dropdown-button" 
                          onClick={() => {setShowDTDDropdown(!showDTDDropdown); setShowDTRDropdown(false); setShowSendDropdown(false); setShowDataDropdown(false) }}>
                        Data Token D
                      </button>
                      {showDTDDropdown && (
                        <div className="button">

                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Create
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Reshape
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Transfer
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '60%'}} onClick={() => handlePageChange('todo02')}>
                            Melt
                          </button>

                        </div>
                      )}

                      {/*

                      <button className="dropdown-button" style={{ zIndex: 1 }}  onClick={() => handlePageChange('home03')}>
                        Write Data
                      </button>

                      <button className="dropdown-button" onClick={() => handlePageChange('home04')}>
                        Retrieve Data
                      </button>
                      */}

                      <button className="dropdown-button" onClick={() => handlePageChange('home05')}>
                        UTXO List
                      </button>

                   {/*   </div> */}
                  
                             


                    {/*
                    <button className="dropdown-button" onClick={() => handlePageChange('home06')}>
                      p2pkh to P2PK
                    </button>
                    <button className="dropdown-button" onClick={() => handlePageChange('home07')}>
                      P2PK to P2PK 
                    </button>
                      */}

                    <button className="dropdown-button" onClick={() => handlePageChange('todo')}>
                      Todo List Page 1
                    </button>
                    <button className="dropdown-button" onClick={() => handlePageChange('todo02')}>
                      Todo List Page 2
                    </button>
                    
                  </div>
                )}
              </div>

              {/*    
              <button className="button" onClick={() => handlePageChange('helloworld')}>
                Hello World
              </button>

              */}


              <div className="dropdown">
                <button className="button" 
                    onClick={() => {setShowSendDropdown(false); setShowTodoDropdown(false); setShowHWDropdown(false); setShowSCDropdown(!showSCDropdown); setShowHomeDropdown(false)}}>
                  Smart Contracts
                </button>
                {showSCDropdown && (
                  <div className="dropdown-content">


                    {/*

                    <div className="dropdown-content">
                      <button className="dropdown-button" 
                          onClick={() => {setShowHWDropdown(!showHWDropdown); setShowContDropdown(false)}}>
                        Hello World
                      </button>
                      {showHWDropdown && (
                        <div className="button">
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('helloworld')}>
                            Deploy
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('helloworld02')}>
                            Interact
                          </button>
                        </div>
                      )}
                    </div>
                    */}

                    <button className="dropdown-button" 
                          onClick={() => {setShowHWDropdown(!showHWDropdown); setShowContDropdown(false)}}>
                        Hello World
                    </button>
                    {showHWDropdown && (
                        <div className="button">
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('helloworld')}>
                            Deploy
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('helloworld02')}>
                            Interact
                          </button>
                        </div>
                    )}


                    <button className="dropdown-button" onClick={() => handlePageChange('home03')}>
                      Write Data
                    </button>
                    <button className="dropdown-button" onClick={() => handlePageChange('home04')}>
                      Retrieve Data
                    </button>

                    <button className="dropdown-button" onClick={() => handlePageChange('todo')}>
                      Todo List Page 1
                    </button>
                    <button className="dropdown-button" onClick={() => handlePageChange('todo02')}>
                      Todo List Page 2
                    </button>

                    <button className="dropdown-button" 
                          onClick={() => {setShowContDropdown(!showContDropdown); setShowHWDropdown(false) }}>
                        Counter
                    </button>
                    {showContDropdown && (
                        <div className="button">
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto',  marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter')}>
                            Deploy
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter02')}>
                            Increment
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter03')}>
                            Decrement
                          </button>
                          <button className="dropdown-button-right" style={{ border: '1px solid #fff', marginLeft: 'auto', marginRight: '0', 
                          fontSize: '12px',color: 'white', background: '#323a3c', width: '50%'}} onClick={() => handlePageChange('Counter04')}>
                            Finish
                          </button>
                        </div>
                    )}


                  </div>
                )}  
              </div>

              {/*          
              <div className="dropdown">
                <button className="button" 
                    onClick={() => {setShowHWDropdown(!showHWDropdown); setShowTodoDropdown(false); setShowHomeDropdown(false); setShowSCDropdown(false)}}>
                  Hello World
                </button>
                {showHWDropdown && (
                  <div className="dropdown-content">
                    <button className="dropdown-button" onClick={() => handlePageChange('helloworld')}>
                      Deploy
                    </button>
                    <button className="dropdown-button" onClick={() => handlePageChange('helloworld02')}>
                      Interact
                    </button>
                  </div>
                )}
              </div>

              */}



            </nav>

            {currentPage === 'home' && <Home />}
            {currentPage === 'todo' && <TodoList />}
            {currentPage === 'home02' && <Page01TX />}
            {currentPage === 'home03' && <Page02Write />}
            {currentPage === 'home04' && <Page03Read />}
            {currentPage === 'home05' && <Page04UtxoL />}
            {currentPage === 'home06' && <Page05P2PKC />}
            {currentPage === 'home07' && <Page06P2PK2P2PK />}
            {currentPage === 'home08' && <Page07p2pk2p2pkh />}
            {currentPage === 'home09' && <Page08TXDidactic />}
            {currentPage === 'home10' && <Page09SigForge />}
            {currentPage === 'home11' && <Page10Sig2QA />}
            {currentPage === 'home12' && <Page11SigVerify />}


            {currentPage === 'todo02' && <TodoList02 />}

            {currentPage === 'helloworld' && <DeployACT />}
            {currentPage === 'helloworld02' && <DeployACT02 />}
            
            {currentPage === 'Counter' && <DeployACT03 />}
            {currentPage === 'Counter02' && <DeployACT02 />}
            {currentPage === 'Counter03' && <DeployACT />}
            {currentPage === 'Counter04' && <DeployACT02 />}
                  

            {/*
            <nav className="navbar">
              <button className="button" onClick={() => handlePageChange('home')}>
                Home
              </button>
              <button className="button" onClick={() => handlePageChange('todo')}>
                Todo List
              </button>
              <button className="button" onClick={() => handlePageChange('helloworld')}>
                Hello World
              </button>
            </nav>

            {currentPage === 'home' && <Home />}
            {currentPage === 'todo' && <TodoList />}
            {currentPage === 'helloworld' && <DeployACT />}

            */}

            {/*

            <header className="App-header">

            <h2 style={{ fontSize: '34px', paddingBottom: '5px', paddingTop: '5px'}}>Hello World - sCrypt & React --HOME</h2>

            <div style={{ textAlign: 'center' }}>
                      
                      <label style={{ fontSize: '14px', paddingBottom: '5px' }}
                        >Press Deploy to Create the Contract:  
                      </label>     
            </div>
            <button className="insert" onClick={deploy}
                    style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '5px'}}
            >Deploy</button>

                                  
            <div>

              <div style={{ textAlign: 'center' }}>
                    
                    <label style={{ fontSize: '14px', paddingBottom: '2px' }}
                      >Inform the Current TXID and press Unlock to use the Contract:  
                    </label>     
              </div>

              <div style={{ display: 'inline-block', textAlign: 'center' }}>
                <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
                    > 
                        <input ref={txid} type="hex" name="PVTKEY1" min="1" defaultValue={'TXID'} placeholder="hex" />
                    </label>     
                </div>
                <div style={{ display: 'inline-block', textAlign: 'center' }}>
                    
                    <button className="insert" onClick={interact}
                        style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '20px'}}
                    >Unlock</button>

                </div>
            </div>                      
          </header>

          */}


          

        </div>

 

  );
}

export default App;
