// src/components/Home.tsx
import React, {FC} from 'react';
import { useState, useRef, useEffect } from "react";
import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString } from "scrypt-ts";
import './App.css';
import { pvtkey } from './globals';

export let homepvtKey: string = "";
export let homenetwork = bsv.Networks.testnet;
export let compState = true;



//const provider = new DefaultProvider({network: homenetwork});
let signer: TestWallet;

const Home: FC = () => {

  const [pubkey, setPubkey] = useState("");
  const [address, setaddress] = useState("");
  const [balance, setbalance] = useState(0);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const labelRef02 = useRef<HTMLLabelElement | null>(null);
  const labelRef03 = useRef<HTMLLabelElement | null>(null);

  const [netbitcoin, setnet] = useState("TestNet");
  const [addcomp, setcomp] = useState("Compressed");


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


  let localPvtKey = useRef<any>(null);


  async function delayHere() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500); // 2000 milliseconds = 2 seconds
    });
  }

  let cont = 0

  //Apresentar o Balance do Endereço
  useEffect(() => {
    console.log("Call useEffect")
    if(cont === 0)
    {    setBalance(0);
    }
    cont++
  }, []);  

  const setBalance = async (amount: any) => {

    if(homepvtKey.length === 64)
    {
        localPvtKey.current.value = homepvtKey;

        if(homepvtKey.length !== 64)
        {
          alert("Wrong PVT Key");
          setaddress("");
          setPubkey("");
          setbalance(0);
          
        }
        else
        {
          setaddress("Wait!!!");
          setPubkey("Wait!!!");
    
          //bsv.PrivateKey.fromHex
          let privateKey = bsv.PrivateKey.fromHex(homepvtKey, homenetwork);
          //let privateKey = bsv.PrivateKey.fromHexAddComp(homepvtKey, homenetwork, compState);
          privateKey.compAdd(compState);
    
          privateKey = bsv.PrivateKey.fromHex(homepvtKey, homenetwork);
          //privateKey.fromHexAddComp(homepvtKey, homenetwork, compState);
        
    
          let provider = new DefaultProvider({network: homenetwork});
    
          signer = new TestWallet(privateKey, provider)
           
          //Linha necessária nesta versão
          //O signee deve ser connectado
          console.log("Até aqui: ", cont)

          //Dealy antes de tentar conectar;
          //await delayHere()

          await signer.connect(provider)

          console.log("PVT KEY 1: ", privateKey.compressed, " cont: ", cont)
          //console.log("Até aqui depois: ", cont)

    
          try {

            //await signer.connect(provider)

            //cont = cont + 1;
    
            //pvtkey = "acb";
            //alert('PVT Key: ' + localPvtKey.current.value)
            await signer.getBalance(bsv.Address.fromPrivateKey(privateKey)).then(balance => {
              // UTXOs belonging to transactions in the mempool are unconfirmed
              setbalance(balance.confirmed + balance.unconfirmed)
            })
    
            setPubkey(bsv.PublicKey.fromPrivateKey(privateKey).toString())
    
            setaddress(bsv.Address.fromPrivateKey(privateKey).toString())
    
            //alert('PVT Key: ' + homepvtKey)
      
    
          } catch (e) {
            console.error('Failed', e)
            alert('Failed')
          }
        }
    }
  };


  //let privateKey = bsv.PrivateKey;


  const insertPVT = async (amount: any) => {

    homepvtKey = localPvtKey.current.value;

    if(homepvtKey.length !== 64)
    {
      alert("Wrong PVT Key");
      setaddress("");
      setPubkey("");
      setbalance(0);
    }
    else
    {
      setaddress("Wait!!!");
      setPubkey("Wait!!!");

      //bsv.PrivateKey.fromHex
      let privateKey = bsv.PrivateKey.fromHex(homepvtKey, homenetwork);
      //let privateKey = bsv.PrivateKey.fromHexAddComp(homepvtKey, homenetwork, compState);
      privateKey.compAdd(compState);

      privateKey = bsv.PrivateKey.fromHex(homepvtKey, homenetwork);
      //privateKey.fromHexAddComp(homepvtKey, homenetwork, compState);
    

      let provider = new DefaultProvider({network: homenetwork});

      signer = new TestWallet(privateKey, provider)

      console.log("Na chave: ")

      //Linha necessária nesta versão
      //O signee deve ser connectado
      await signer.connect(provider)

      //console.log("Home Network : ", homenetwork)
      //console.log("PVT KEY : ", homepvtKey)
      //console.log("PVT KEY length: ", homepvtKey.length)

      console.log("PVT KEY 2: ", privateKey.compressed)

      try {

        //pvtkey = "acb";
        //alert('PVT Key: ' + localPvtKey.current.value)
        await signer.getBalance(bsv.Address.fromPrivateKey(privateKey)).then(balance => {
          // UTXOs belonging to transactions in the mempool are unconfirmed
          setbalance(balance.confirmed + balance.unconfirmed)
        })

        setPubkey(bsv.PublicKey.fromPrivateKey(privateKey).toString())

        setaddress(bsv.Address.fromPrivateKey(privateKey).toString())

        //alert('PVT Key: ' + homepvtKey)
  

      } catch (e) {
        console.error('Failed', e)
        alert('Failed')
      }
    }
  };

  const net = async (amount: any) => {

    if(netbitcoin == "TestNet")
    {
      homenetwork = bsv.Networks.mainnet;
      setnet("MainNet");
      insertPVT(0);
    }
    else
    {
      homenetwork = bsv.Networks.testnet;
      setnet("TestNet");
      insertPVT(0);
      //insertPVT.caller();
    }

  };

  const addComp = async (amount: any) => {


    if(addcomp == "Compressed")
    {
      setcomp("Uncompressed");
      compState = false
      insertPVT(0);
    }
    else
    {
      setcomp("Compressed");
      compState = true
      insertPVT(0);
    }

  };

  return (

    <div className="App-header">
      <h2 style={{ fontSize: '34px', paddingBottom: '5px', paddingTop: '5px'}}>

        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        
        Access Console
        
      </h2>


      <div>
          <div style={{ textAlign: 'center', paddingBottom: '20px'  }}>
                
                <label style={{ fontSize: '14px', paddingBottom: '2px' }}
                  >{netbitcoin}  
                </label>     
                <button className="insert" onClick={net}
                  style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '20px'}}
                >Switch </button>         
          </div>
      </div>

      <div>
          <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                
                <label style={{ fontSize: '14px', paddingBottom: '2px' }}
                  > {addcomp} Add  
                </label>     
                <button className="insert" onClick={addComp}
                  style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '20px'}}
                >Switch </button>
          </div>
      </div>
      

      <div>

        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
              
              <label style={{ fontSize: '14px', paddingBottom: '2px' }}
                >Insert Your HEX Private Key:  
              </label>     
        </div>

        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
          <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
              > 
                 {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                 <input ref={localPvtKey} type="password" name="PVTKEY1" min="1" placeholder="hex" />
              </label>     
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
              
              <button className="insert" onClick={insertPVT}
                  style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '20px'}}
              >Insert</button>

          </div>
      </div>

      <div className="label-container" style={{ textAlign: 'center' }}>
                          <label className="responsive-label" htmlFor="output1"  style={{ fontSize: '12px', paddingBottom: '20px' }}                           
                          >
                              {'SEC Pub Key: ' + pubkey} 
                          </label>
                          <output id="output1"></output>

                        {/*
                          <label className="responsive-label" ref={labelRef} style={{ fontSize: '12px', paddingBottom: '5px' }} 
                          >
                            {pubkey}

                          </label>       */}            
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                          <label htmlFor="output1"  style={{ fontSize: '12px', paddingBottom: '5px' }}                           
                          >
                              {'Address: '} 
                          </label>
                          <output id="output1"></output>

                          <label ref={labelRef02} style={{ fontSize: '12px', paddingBottom: '5px' }} 
                          >
                            {address}

                          </label>                   
        </div>

        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                          <label htmlFor="output1"  style={{ fontSize: '12px', paddingBottom: '5px' }}                           
                          >
                              {'Balance: '} 
                          </label>
                          <output id="output1"></output>

                          <label ref={labelRef03} style={{ fontSize: '12px', paddingBottom: '5px' }} 
                          >
                            {balance} satoshis

                          </label>                   
        </div>

        {
          setaddress.length > 10?
          <button onClick={handleCopyClick}>Copy to ClipBoard</button>:
          ""
        }                  


    </div>
  );
};

export default Home;