import React, { useRef, FC, useState} from 'react';

import logo from './logo.svg';
import './App.css';

import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString } from "scrypt-ts";
import { Statefulsc } from "./contracts/stateful";
import {homepvtKey} from './Home';


const provider = new DefaultProvider({network: bsv.Networks.testnet});
let Alice: TestWallet
let signerExt: TestWallet
//let privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)
//let privateKey = bsv.PrivateKey.fromHex("0000000000000000000000000000000000000000000000000000000000000000", bsv.Networks.testnet)
//"79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0"
//"0000000000000000000000000000000000000000000000000000000000000000" 

function DeployACT03() {
//const  deployACT: FC = () => {  


  const [deployedtxid, setdeptxid] = useState("");
  const labelRef = useRef<HTMLLabelElement | null>(null);

  const handleCopyClick = () => {
    if (labelRef.current) {
      navigator.clipboard.writeText(labelRef.current.innerText)
        .then(() => {
          alert('Copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy to clipboard:', error);
        });
    }
  };

  const deploy = async (amount: any) => {

    if(homepvtKey.length != 64)
    {
      alert('No PVT KEY inserted!!!')
    }
    else
    {
      setdeptxid("Wait!!!")

      let privateKey = bsv.PrivateKey.fromHex(homepvtKey, bsv.Networks.testnet)

      Alice = new TestWallet(privateKey, provider)

      try {

        //await Statefulsc.compile()

        const amount = 1000

        const signer = Alice
              //const message = toByteString('hello world', true)
        //Linha necessária nesta versão
        //O signee deve ser connectado
        await signer.connect(provider)


        console.log('Até aqui: ')
        
        const instance = new Statefulsc(0n)
        
        await instance.connect(signer);

        console.log('Até aqui: ')
        const deployTx = await instance.deploy(amount)
        console.log('Counter contract deployed: ', deployTx.id)
        //alert('deployed: ' + deployTx.id)
        setdeptxid(deployTx.id)
        

      } catch (e) {
        console.error('deploy Counter failes', e)
        alert('deploy Counter failes')
      }
    }
  };


  /*
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

  */

  const txid = useRef<any>(null);

  return (
    <div className="App">



        <header className="App-header">
          

        <h2 style={{ fontSize: '34px', paddingBottom: '5px', paddingTop: '5px'}}>

          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          Counter - sCrypt & React
        
        </h2>

        <div style={{ textAlign: 'center' }}>
                  
                  <label style={{ fontSize: '14px', paddingBottom: '5px' }}
                    >Press Deploy to Create the Contract:  
                  </label>     
        </div>
        <button className="insert" onClick={deploy}
                style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '5px'}}
        >Deploy</button>
                              

        {/* <img src={logo} className="App-logo" alt="logo" /> 
        
        <a
          className="App-link"
          href="https://www.youtube.com/watch?v=MnfzAx-A1oA&list=PLe_C0QmVAyivD40DXYtUVSAFmx7ntGjJZ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn sCrypt
        </a>
        */}

        {/*
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

        */}

        <div style={{ textAlign: 'center' }}>
                          <label htmlFor="output1"  style={{ fontSize: '12px', paddingBottom: '5px' }}                           
                          >
                              {'Deployed TXID: '} 
                          </label>
                          <output id="output1"></output>

                          <label ref={labelRef} style={{ fontSize: '12px', paddingBottom: '5px' }} 
                          >
                            {deployedtxid}

                          </label>                   
        </div>
        {
          deployedtxid.length === 64?
          <button onClick={handleCopyClick}>Copy to ClipBoard</button>:
          ""
        }                  

      </header>
    </div>
  );
}

export default DeployACT03;
