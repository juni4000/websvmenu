import React, { useRef, FC, useState} from 'react';

import logo from './logo.svg';
import './App.css';

import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString } from "scrypt-ts";
import { Helloworld02 } from "./contracts/helloworld02";


const provider = new DefaultProvider({network: bsv.Networks.testnet});
let Alice: TestWallet
let signerExt: TestWallet
const privateKey = bsv.PrivateKey.fromHex("79342a4c317817a80a298fe116147a74e4e90912a4f321e588a4db67204e29b0", bsv.Networks.testnet)   

function DeployACT02() {
//const  deployACT: FC = () => {  

/*
  const deploy = async (amount: any) => {

    Alice = new TestWallet(privateKey, provider)

    try {

      const signer = Alice
      const message = toByteString('hello world', true)
      const instance = new Helloworld02(sha256(message))
      
      await instance.connect(signer);
          
      const deployTx = await instance.deploy(100)
      console.log('Helloworld contract deployed: ', deployTx.id)
      alert('deployed: ' + deployTx.id)

    } catch (e) {
      console.error('deploy HelloWorld failes', e)
      alert('deploy HelloWorld failes')
    }
  };

  */

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

  const interact = async (amount: any) => {
    setdeptxid("Wait!!!")

    Alice = new TestWallet(privateKey, provider)

    try {

      const signer = Alice

      //Linha necessária nesta versão
      //O signee deve ser connectado
      await signer.connect(provider)

      
      const message = toByteString('hello world', true)
      let tx = new bsv.Transaction
      tx = await provider.getTransaction(txid.current.value)
  
      console.log('Current State TXID: ', tx.id)

      const instance = Helloworld02.fromTx(tx, 0) 
      await instance.connect(signer)
  
      const { tx: callTx } = await instance.methods.unlock(message)
      console.log('Helloworld contract `unlock` called: ', callTx.id)
      //alert('unlock: ' + callTx.id)
      setdeptxid(callTx.id)
  
    } catch (e) {
      console.error('deploy HelloWorld failes', e)
      alert('deploy HelloWorld failes')
    }
  };

  const txid = useRef<any>(null);

  return (
    <div className="App">
        <header className="App-header">

        <h2 style={{ fontSize: '34px', paddingBottom: '5px', paddingTop: '5px'}}>

          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>   
          Hello World - sCrypt & React
          
        </h2>

        {/*
        <div style={{ textAlign: 'center' }}>
                  
                  <label style={{ fontSize: '14px', paddingBottom: '5px' }}
                    >Press Deploy to Create the Contract:  
                  </label>     
        </div>
        <button className="insert" onClick={deploy}
                style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '5px'}}
        >Deploy</button>

        */}
                              

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

        <div>

          <div style={{ textAlign: 'center' }}>
                
                <label style={{ fontSize: '14px', paddingBottom: '2px' }}
                  >Inform the Valid TXID and press Unlock to use the Contract:  
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

        {/*
        <div style={{ textAlign: 'center' }}>
                          <label htmlFor="output1"  style={{ fontSize: '12px', paddingBottom: '5px' }}                           
                          >
                              {'Deployed TXID: ' + deployedtxid} 
                          </label>
                          <output id="output1"></output>
                   
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

export default DeployACT02;
