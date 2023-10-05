// src/components/Home.tsx
import React, {FC} from 'react';

//import videojs from 'video.js';
//import 'video.js/dist/video-js.css'; // Import Video.js CSS
//import 'video-react/dist/video-react.css'; // Import Video.js React CSS
//import { Player } from "video-react";


import { useState, useRef, useEffect } from "react";
import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString, ByteString } from "scrypt-ts";
import './App.css';
import { pvtkey } from './globals';

import {homepvtKey, homenetwork, compState} from './Home';
import { broadcast } from './Broadcast';

import * as fs from 'fs';
import { wait } from '@testing-library/user-event/dist/utils';

const filePath = './tokendata/images.jfif';
//const filePath = './tokendata/PushData01.txt';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substring(i * 2, (i * 2) + 2), 16);
    }
    
    return bytes;
  }

let signer: TestWallet;

const Page04UtxoL: FC = () => {

  //const [pubkey, setPubkey] = useState("");
  const [address, setaddress] = useState("");
  const [balance, setbalance] = useState(0);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const labelRef02 = useRef<HTMLLabelElement | null>(null);
  const labelRef03 = useRef<HTMLLabelElement | null>(null);

  //let txlink = useRef<HTMLLabelElement | null>(null);

  //const [linkUrl, setLinkUrl] = useState('https://whatsonchain.com/');
  const [linkUrl, setLinkUrl] = useState("");
  const [txid, setTXID] = useState("");

  const [fileType, setfileType] = useState("bin");


  const [downloadFile, setdownloadFile] = useState(false);


  const [waitAlert, setwaitAlert] = useState("Inform a Script Hash of Address to Start");



  const [txb, settxb] = useState(true);


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [binaryData, setbinaryData] = useState<Uint8Array>(new Uint8Array());
  const [strData, setstrData] = useState('');


  let imageBlob = new Blob([binaryData], { type: 'image/jpeg' }); // Adjust the type based on the image format
  let imageUrl = URL.createObjectURL(imageBlob);  
  let htmlDataP = new TextDecoder('utf-8').decode(binaryData);

  let videoBlob = new Blob([binaryData], { type: 'video/mp4' });
  //let videoBlob = new Blob([binaryData], { type: 'video/wmv' });
  let videoUrl = URL.createObjectURL(videoBlob);


  const convertBinaryToHexString = (binaryString: any) => {
    const bytes = [];
    for (let i = 0; i < binaryString.length; i++) {
      const byte = binaryString.charCodeAt(i).toString(16).padStart(2, '0');
      bytes.push(byte);
    }
    return bytes.join('');
  };

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

  let txIdRet = useRef<any>(null);
  let satsAmount = useRef<any>(null);
  let txlink2 = ""

  //let data = "";


  const setBalance = async (amount: any) => {

    //homepvtKey = localPvtKey.current.value;

    console.log("setBalance!!!")

    if(homepvtKey.length !== 64)
    {
      alert("Wrong PVT Key");
      setaddress("");
      setbalance(0);
    }
    else
    {
      setaddress("Wait!!!");

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
      await signer.connect(provider)

      console.log("PVT KEY: ", privateKey.compressed)

      try {

        //await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
        //pvtkey = "acb";
        //alert('PVT Key: ' + localPvtKey.current.value)
        await signer.getBalance(bsv.Address.fromPrivateKey(privateKey)).then(balance => {
          // UTXOs belonging to transactions in the mempool are unconfirmed
          setbalance(balance.confirmed + balance.unconfirmed)


          console.log("Bal: ", balance.confirmed + balance.unconfirmed)

        })

        console.log("Bal: ", bsv.Address.fromPrivateKey(privateKey).toString())


        setaddress(bsv.Address.fromPrivateKey(privateKey).toString()) 

      } catch (e) {
        console.error('Failed', e)
        alert('Failed')
      }
    }
  };

  let cont = 0

  //Apresentar o Balance do Endereço
  useEffect(() => {
    console.log("Call useEffect")
    if(cont === 0)
    {    setBalance(0);
    }
    cont++
  }, []); 
  


  //let binaryData = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]);
  
  //let binaryData: Uint8Array

  const downloadBinaryFile = () => {
    // Create a Blob from the binary data
    const blob = new Blob([binaryData]);

    console.log("File Size: ", binaryData?.byteLength)

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UTXOs-'+ txIdRet.current.value + '.' + fileType; // Specify the desired file name with the correct extension

    // Programmatically trigger a click event on the anchor element
    a.click();

    // Clean up the URL object and remove the anchor element
    URL.revokeObjectURL(url);
    a.remove();
  };
  

  const readFromChain = async (amount: any) => {

    //homepvtKey = localPvtKey.current.value;
    setdownloadFile(false)

    if(homepvtKey.length !== 64)
    {
      alert("Wrong PVT Key");
      setaddress("");
      setbalance(0);
      settxb(false);
      setLinkUrl("");
      setTXID("")
    }
    else
    {
      setLinkUrl('');
      setTXID('')
      setwaitAlert("Wait!!!");

  
      let provider = new DefaultProvider({network: homenetwork});

      await provider.connect()


      let tx3 = new bsv.Transaction

      //Place here the TXID of the current state of the contract
      //tx3 = await provider.getTransaction(txIdRet.current.value);


      let alertTXT
      //console.log('Test TX3: ', tx3.id)
      let changeADD;
      //let UTXOs = new bsv.Transaction.IUnspentOutput(txIdRet.current.value.length);
      let UTXOs;

      let alertMain = false

      if(txIdRet.current.value.length !== 64)
      {
          changeADD = bsv.Address.fromString(txIdRet.current.value);

          if(txIdRet.current.value.substring(0,1) === '1')
          {
            console.log("Main")
            provider = new DefaultProvider({network: bsv.Networks.mainnet});
            await provider.connect()  
            UTXOs = await provider.listUnspent(changeADD)
            alertMain = true


            //setwaitAlert("Main Net UTXOs")
            //alertTXT = "Main Net UTXO"
          }
          else
          {
            console.log("Test")
            provider = new DefaultProvider({network: bsv.Networks.testnet});
            await provider.connect()  
            UTXOs = await provider.listUnspent(changeADD)
            alertMain = false


            //setwaitAlert("Test Net UTXOs")
            //alertTXT = "Test Net UTXO"
          }
          //let UTXOs = await provider.listUnspent(toADD)
          console.log("Add: ", changeADD)
      }
      else
      {
        UTXOs = await provider.listUnspent(txIdRet.current.value)

        if(homenetwork === bsv.Networks.mainnet)
        {
          alertMain = true
          //setwaitAlert("Main Net UTXOs")
          //alertTXT = "Main Net UTXO"
        }
        else
        {
          alertMain = false
          //setwaitAlert("Test Net UTXOs")
          //alertTXT = "Test Net UTXO"
        }
      }
      console.log("UTXOs: ", UTXOs)

      if(UTXOs.length === 0)
        setwaitAlert(alertTXT + " not found!!!")
      else
      {
        tx3 = await provider.getTransaction(UTXOs[0].txId);

        let rawdata = "{height: " + UTXOs[0].height.toString() 
                    + ", tx_pos: " + UTXOs[0].outputIndex.toString()
                    + ", tx_hash: " + UTXOs[0].txId
                    + ", value: " + UTXOs[0].satoshis
                    + ", script: " + tx3.outputs[UTXOs[0].outputIndex].script.toHex() + "}"

        

        for(let i = 1; i < UTXOs.length; i++)
        {

          //await wait(500)

          //tx3 = await provider.getTransaction(UTXOs[i].txId);

          //tx3.outputs[0].script

          rawdata += ",\n{height: " + UTXOs[i].height.toString() 
                    + ", tx_pos: " + UTXOs[i].outputIndex.toString()
                    + ", tx_hash: " + UTXOs[i].txId
                    + ", value: " + UTXOs[i].satoshis 
                    //+ ", script: " + tx3.outputs[UTXOs[i].outputIndex].script.toHex() + "}"
                    //Os scripts serão todos inguais, então só precisamos de uma TX
                    + ", script: " + tx3.outputs[UTXOs[0].outputIndex].script.toHex() + "}"
          //if(i < UTXOs.length )  rawdata +=        
        }          

        if(alertMain)
        {
          //alertMain = true
          setwaitAlert("Main Net UTXOs")
          alertTXT = "Main Net UTXO"
        }
        else
        {
          //alertMain = false
          setwaitAlert("Test Net UTXOs")
          alertTXT = "Test Net UTXO"
        }
        
        

        const currentDate = new Date();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const formattedDate = currentDate.toLocaleDateString(); // Example: "9/28/2023"
        const formattedTime = currentDate.toLocaleTimeString(); // Example: "10:30:45 AM"
                
        let dataTX = alertTXT + " list of:\n" + txIdRet.current.value
                    + "\nOn: "+ formattedDate + " at: " + formattedTime + " time zone: " + timeZone 
                    //+ "\n" + toHex(rawdata)//+ UTXOs[0].height.toString())
                    + "\n" + (rawdata)//+ UTXOs[0].height.toString());

        //console.log("data B: ", dataTX)            

        dataTX = toByteString(dataTX, true)

        //console.log("data A: ", dataTX)

        setfileType('txt')    

   
        //const hexString = "48656c6c6f20576f726c64"; // Example hex string
        const bytes = hexToBytes(dataTX);
        //console.log(bytes); // Outputs: Uint8Array [ 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100 ]
        //console.log('TXID New State: ', callTx.id)   

        // Replace this with your binary data

        //console.log("Size before: ", binaryData.length)

        setbinaryData(bytes)

        setstrData(new TextDecoder('utf-8').decode(bytes))

        imageBlob = new Blob([bytes], { type: 'image/jpeg' }); // Adjust the type based on the image format
        imageUrl = URL.createObjectURL(imageBlob);  

        htmlDataP = new TextDecoder('utf-8').decode(bytes);

        videoBlob = new Blob([bytes], { type: 'video/mp4' });
        //videoBlob = new Blob([bytes], { type: 'video/wmv' });
        videoUrl = URL.createObjectURL(videoBlob);  

        //binaryData = new Uint8Array(bytes);
        //console.log("Size after: ", binaryData.length)

        if(bytes.length > 0)
        {
          setdownloadFile(true)
          //setwaitAlert("Download File!!!");

          console.log("download file: ", downloadFile)
          console.log("File Type: ", fileType)

        }
        else
        {
          setwaitAlert("Try Again!!!");
        }
      }       
    }

  };

  const labelStyle = {
    backgroundColor: 'black',
    color: 'white',
    padding: '5px 5px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '14px', 
    paddingBottom: '5px'
  };

  const iframeStyle = {
    width: '60%', // Use 100% of the parent container's width
    height: 'auto', // Automatically adjust height based on content
  };

  const contentStyle = {
    background: 'gray',
    color: 'black',
    fontSize: '12px',
    width: '80%',
    

  };

  const containerStyle = {
    //width: '300px', // Set the width of the container
    //height: '200px', // Set the height of the container
    width: '80%',
    height: 'auto',
    overflow: 'hidden', // Hide any overflow outside the container
    //display: 'flex',
    //alignItems: 'center',
    //justifyContent: 'center',
  };

  const imageStyle = {
    //width: '80%', // Make the image fit the container width
    maxWidth: '80%',
    height: 'auto', // Automatically adjust the height while maintaining aspect ratio
  };


  const containerStyleV = {
    //width: '300px', // Set the width of the container
    //height: '200px', // Set the height of the container
    width: '80%',
    //maxWidth: '400px !important', // Set a maximum width to constrain the player's size
    height: 'auto',
    overflow: 'hidden', // Hide any overflow outside the container
    //display: 'flex',
    //alignItems: 'center',
    //justifyContent: 'center',
  };

  const videoStyle = {

    width: '80%', // Set the width of the container
    height: 'auto', // Set the height of the container

    //width: '80%', // Make the image fit the container width
    //maxWidth: '80%',
    //height: '20%', // Automatically adjust the height while maintaining aspect ratio
  };


  return (

    <div className="App-header">
      <h2 style={{ fontSize: '34px', paddingBottom: '5px', paddingTop: '0px'}}>

        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          
        UTXO List        
      </h2>

      <div>
        <div className="label-container" style={{ fontSize: '14px', paddingBottom: '0px', paddingTop: '20px' }}>
                  <p className="responsive-label" style={{ fontSize: '12px' }}>Script Hash or Address: {' '} </p>
        </div>

        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
          <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
              > 
                 {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                 <input ref={txIdRet} type="hex" name="PVTKEY1" min="1" placeholder="script hash or add" />
              </label>     
          </div>
      </div>

      <div>
          <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
              
              <button className="insert" onClick={readFromChain}
                  style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '0px'}}
              >Read</button>

          </div>
      </div>

      {
        downloadFile?
        <div>
        <div style={{ display: 'inline-block', textAlign: 'center'}}>
            
            <button className="insert" onClick={downloadBinaryFile}
                style={{ fontSize: '14px', paddingBottom: '2px', marginLeft: '0px'}}
            >Dowload</button>

        </div>
        </div>
        :
        <div></div>
      }

      {
          txb?
          waitAlert ===''?
              <div>
                <div className="label-container" style={{ fontSize: '14px', paddingBottom: '0px', paddingTop: '5px' }}>
                  <p className="responsive-label" style={{ fontSize: '12px' }}>TXID: {txid} </p>
                </div>
                <div className="label-container" style={{ fontSize: '14px', paddingBottom: '5px', paddingTop: '0px' }}>
                  <p className="responsive-label" style={{ fontSize: '12px' }}>TX link: {' '} 
                      <a href={linkUrl} target="_blank" style={{ fontSize: '12px'}}>
                      {linkUrl}</a></p>
                </div>
              </div>
              :
              <div className="label-container" style={{ fontSize: '14px', paddingBottom: '5px', paddingTop: '5px' }}>
              <p className="responsive-label" style={{ fontSize: '12px' }}>{waitAlert} </p>
              </div>  
          :
          <div></div>
      }           

      {
        downloadFile?
        
          fileType == 'txt'?
          <div>
            <h1 style={{ fontSize: '14px', paddingBottom: '5px', paddingTop: '0px'}}>File Content</h1>
              
              {/* Create an iframe to embed the file with responsive dimensions */}
            
              <iframe
                //src= {binaryData} //"path-to-your-file.pdf"
                srcDoc= {strData}
                //style={iframeStyle}
                style={{ fontSize: '12px', color: 'white !important', background: 'white', width: '80%'}}
                title="File Presentation"
                allowFullScreen // Allows full-screen mode
              ></iframe>

          </div>
          :           
          <div>
          <h1 style={{ fontSize: '14px', paddingBottom: '5px', paddingTop: '0px'}}>File Content</h1>
            
          
            <iframe
              //src= {binaryData} //"path-to-your-file.pdf"
              srcDoc= {'Content of this file cannot be displayed here. Download to see content!!!'}
              //style={iframeStyle}
              style={{ fontSize: '12px', color: 'white !important', background: 'white', width: '80%'}}
              //title="File Presentation"
              allowFullScreen // Allows full-screen mode
            ></iframe>

          </div>
        :
        <div>
          {/* Divisão final de downloadFile?*/}
        </div>
      }


    </div>
  );
};

export default Page04UtxoL;