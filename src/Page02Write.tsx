// src/components/Home.tsx
import React, {FC} from 'react';
import { useState, useRef, useEffect } from "react";
import { DefaultProvider, sha256, toHex, PubKey, bsv, TestWallet, Tx, toByteString, ByteString, hash256 } from "scrypt-ts";
import './App.css';
import { pvtkey } from './globals';
//import * as request from 'request';
import { broadcast } from './Broadcast';

import {homepvtKey, homenetwork, compState} from './Home';

import * as fs from 'fs';

const filePath = './tokendata/GenTokenlData.txt';
//const filePath = './tokendata/PushData01.txt';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

//export let homepvtKey: string = "";
//export let homenetwork = bsv.Networks.testnet;
//export let compState = true;




//const provider = new DefaultProvider({network: homenetwork});
let signer: TestWallet;

const Page02Write: FC = () => {

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


  const [waitAlert, setwaitAlert] = useState("Choose Text or File to Start");



  const [txb, settxb] = useState(true);


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [hexStrFileData, setHexString] = useState('');
  const [sendButton, setsendButton] = useState(true);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    setwaitAlert("Press WRITE to Send File");
    settxb(true)

    const file = event.target.files && event.target.files[0];
    //setSelectedFile(file);

    if (file) {
      setSelectedFile(file);
      // Create a FileReader
      const reader = new FileReader();

      // Define a callback function for when the file is loaded
      reader.onload = (e) => {
        if(e.target)
        {
          const binaryString = e.target.result; // The file data as a binary string
          const hexString = convertBinaryToHexString(binaryString);

          console.log("Data hexString: ", hexString)

          setHexString(hexString);
        }
      };
      // Read the file as an ArrayBuffer
      //reader.readAsArrayBuffer(file);
      reader.readAsBinaryString(file);
    }
  };
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

  let txtData = useRef<any>(null);
  let satsAmount = useRef<any>(null);
  let txlink2 = ""
  let utxoList = useRef<any>(null);
  let changeAddEx = useRef<any>(null);

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

  const handleSendButton = () => {
    if (sendButton) {
      setsendButton(false)
      writeToChain(0)
    }
  };

  let txidBC = ''



  async function broadcastHERE(tx: any): Promise <string>
  {
    //console.log(`Message received in worker: ${event.data}`);
    //const url = new URL('https://www.example.com/path?query=value');
    let poolID: number = 0;
    let npools: number = 4
    let TxHexBsv: string = tx;
    let urlAdress01: string = 'https://api.whatsonchain.com/v1/bsv/main/tx/raw';
    let urlAdress02: string = 'https://mapi.gorillapool.io/mapi/tx';
    let urlAdress03: string = 'https://api.bitails.io/tx/broadcast';
    let urlAdress04: string = 'https://api.bitails.io/tx/broadcast/multipart';
    let txID: string = new bsv.Transaction(tx).id;


    if(homenetwork === bsv.Networks.testnet)
    {
      urlAdress01 = 'https://api.whatsonchain.com/v1/bsv/test/tx/raw';
      urlAdress02 = 'https://testnet-mapi.gorillapool.io/mapi/tx';
      urlAdress03 = 'https://test-api.bitails.io/tx/broadcast';
      urlAdress04 = 'https://test-api.bitails.io/tx/broadcast/multipart';
    }

    /////////////////////////////////////////////////
    //JESUS is the LORD!!!
    /////////////////////////////////////////////////

    let url: URL;

    console.log('pool id', poolID)

    let TXJson;

    switch(poolID)
    {
      case 0: url = new URL(urlAdress01);
              TXJson = `{"txhex": "${TxHexBsv}" }`; 
        break;
      case 1: url = new URL(urlAdress02);
              TXJson = `{"rawTx": "${TxHexBsv}" }`;
          break;
      case 2: url = new URL(urlAdress03);
              TXJson = `{"raw": "${TxHexBsv}" }`
        break;
      default: url = new URL(urlAdress04);
              TXJson = `{"raw": "${TxHexBsv}" }`
        break;
    }


    let bcFinish = false
    let cycle = 0
    while(!bcFinish && cycle < npools * 2)
    {
        try {
        
          /*
          if (poolID === 0) {
            url = new URL(urlAdress01);
          } else if (poolID === 1) {
            url = new URL(urlAdress02);
          }
          else if (poolID === 2 ){
            url = new URL(urlAdress03);
          }
          else{
            url = new URL(urlAdress04);
          }

          */

          console.log('URL', url)
          /*

          let TXJson = poolID === 0
          ? `{"txhex": "${TxHexBsv}" }`
          : `{"rawTx": "${TxHexBsv}" }`;

          if(poolID === 2 || poolID === 3)
          {
            TXJson = `{"raw": "${TxHexBsv}" }`;
            //TXJson = `{"raw": "[${TxHexBsv}]"}`;
          }

          */

          let resp ='';
          if(poolID === 3)
          { 
              //https://stackoverflow.com/questions/46640024/how-do-i-post-form-data-with-fetch-api
              const formData = new FormData();

              formData.append('raw', new Blob([Buffer.from(TxHexBsv, 'hex')]));
              formData.append('filename', 'raw');
   
              const response = await fetch(url, {  
                method: 'POST',
                //body: content,
                body: formData,
                //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}             
              }).then(response=>response.text())//then(response=>response.json())
              .then(data=>{
                resp = data; 
                //console.log(data); 
              });
          }
          else
          {
              await fetch(url, {  
                method: 'POST',
                //body: content,
                body: TXJson,
                //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} 
                headers: {
                      'Content-Type': 'application/json',
                      'accept': 'text/plain'
                }

              }).then(response=>response.text())//then(response=>response.json())
              .then(data=>{
                resp = data; 
                //console.log(data); 
              });
          }
                
          if (resp.indexOf(txID) !== -1) {
            
            console.log('Sucess: ', resp);
            bcFinish = true
          } else {

            bcFinish = false
            console.log('Not Sucess: ', resp);
          }

        } catch (e) {
          console.error(e);
        }

        cycle ++;
        poolID ++;
        poolID = poolID % npools;

        console.log('Pool id: ', poolID)
        
      }

      if(bcFinish)
      {
        return txID
      }
      else
      {
        return ''
      }
  }
  
  onmessage = async (event) => {

    //console.log(`Message received in worker: ${event.data}`);
    //const url = new URL('https://www.example.com/path?query=value');
    let poolID: number = event.data[0];
    let TxHexBsv: string = event.data[1];
    let urlAdress: string = event.data[2];
    let urlAdress02: string = event.data[3];
    let urlAdress03: string = event.data[4];
    let txID: string = event.data[5];



    //console.log("\npoolID:", poolID); //não pode ser usada neste contexto;
    //console.log("\nTxHexBsv:", TxHexBsv);
    //console.log("\nurlAdress:", urlAdress);
    //console.log("\nurlAdress02:", urlAdress02);
    //console.log("\nurlAdress03:", urlAdress03);


    /////////////////////////////////////////////////
    //JESUS is the LORD!!!
    /////////////////////////////////////////////////
    
    try {
      let url: URL;


      console.log('pool id', poolID)
    
      if (poolID === 0) {
        url = new URL(urlAdress);
      } else if (poolID === 1) {
        url = new URL(urlAdress02);
      }
      else {
        url = new URL(urlAdress03);
      }

      console.log('URL', url)

      let TXJson = poolID === 0
      ? `{"txhex": "${TxHexBsv}" }`
      : `{"rawTx": "${TxHexBsv}" }`;

          if(poolID === 2)
      {
        TXJson = `{"raw": "${TxHexBsv}" }`;
        //TXJson = `{"raw": "[${TxHexBsv}]"}`;
      }


      let resp ='';
      
      const response = await fetch(url, {  
        method: 'POST',
        //body: content,
        body: TXJson,
        //headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} 
        headers: {
              'Content-Type': 'application/json',
              'accept': 'text/plain'
        }
    
      }).then(response=>response.text())//then(response=>response.json())
      .then(data=>{
        resp = data; 
        //console.log(data); 
      });
        
    
      if (resp.indexOf(txID) !== -1) {
        console.log('Sucess: ', resp);

        txidBC = txID
      //  postMessage('OK');
      } else {

        console.log('Not Sucess: ', resp);
        txidBC = ''
        //console.log('error');
      //  postMessage('error');
      }

    } catch (e) {
      console.error(e);
    }
  };




  const writeToChain = async (amount: any) => {

    //homepvtKey = localPvtKey.current.value;

    if(homepvtKey.length !== 64)
    {
      alert("Wrong PVT Key");
      setaddress("");
      setbalance(0);
      settxb(false);
      setLinkUrl("");
      setTXID("")
      setsendButton(true)
      
    }
    
    else if(txtData.current.value === "" && hexStrFileData === "")
    {
      alert("Missing Data");
      setsendButton(true)
      setwaitAlert("Choose Text or File to Start")
    }
    
    else
    {
      setLinkUrl('');
      setTXID('')
      setwaitAlert("Wait!!!");

      //////////////////////////////////////////////////////////
      //Data Input
      //////////////////////////////////////////////////////////
      let dataToChain: ByteString = '00'
      /*
      // Alternatively, you can read the file synchronously
      try {
          //const data = fs.readFileSync(filePath, 'utf-8');
          //const data = fs.readFileSync(filePath);
          const data = fs.readFileSync(filePath);
          //dataToChain = stringToHex(data)
          dataToChain = bytesToHex(data)
          //console.log(data);
          console.log(data.length);
          //console.log(dataToChain);
          console.log(dataToChain.length);
      } catch (err) {
          console.error('Error reading file:', err);
      }
      */

      let newData = dataToChain;

      newData = hexStrFileData;

      let dataSize = (newData.length/2).toString(16)

      while(dataSize.length < 8)
          dataSize = '0' + dataSize

      let newDataInfo = '000000' + '00' + '00000000'
      let dataInfo1 = '000000'

      if(selectedFile !== null)
      {
        switch(selectedFile.name.split('.')[1])
        {
          case 'txt': 
            dataInfo1 = '000001';
            break;
          case 'jfif': 
            dataInfo1 = '000002';
            break;
          case 'jpg': 
            dataInfo1 = '000003';
            break;          
          case 'jpeg': 
            dataInfo1 = '000004';
            break;              
          case 'm4a': 
            dataInfo1 = '000005';
            break;              
          case 'mov': 
            dataInfo1 = '000006';
            break;              
          case 'mp3': 
            dataInfo1 = '000007';
            break;              
          case 'mp4': 
            dataInfo1 = '000008';
            break;  
          case 'mpeg': 
            dataInfo1 = '000009';
            break;  
          case 'mpg': 
            dataInfo1 = '00000a';
            break;          
          case 'pdf': 
            dataInfo1 = '00000b';
            break;                      
          case 'png': 
            dataInfo1 = '00000c';
            break;   
          case 'ppt': 
            dataInfo1 = '00000d';
            break;   
          case 'pptx': 
            dataInfo1 = '00000e';
            break;   
          case 'rar': 
            dataInfo1 = '00000f';
            break;         
          case 'rtf': 
            dataInfo1 = '000010';
            break;                
          case 'tif': 
            dataInfo1 = '000011';
            break;            
          case 'tiff': 
            dataInfo1 = '000012';
            break;            
          case 'wav': 
            dataInfo1 = '000013';
            break;                
          case 'wma': 
            dataInfo1 = '000014';
            break;            
          case 'wmv': 
            dataInfo1 = '000015';
            break;            
          case 'xls': 
            dataInfo1 = '000016';
            break;            
          case 'xlsx': 
            dataInfo1 = '000017';
            break;            
          case 'zip': 
            dataInfo1 = '000018';
            break;              
          case 'webp': 
            dataInfo1 = '000019';
            break;              
          case 'html': 
            dataInfo1 = '00001a';
            break;          
          case 'csv': 
            dataInfo1 = '00001b';
            break;
          case 'bmp': 
            dataInfo1 = '00001c';
            break;                        
          default:
            dataInfo1 = '000000';
        }
      }

      let dataInfo2 = '00'
      let dataInfo3 = dataSize

      newDataInfo = dataInfo1 + dataInfo2 + dataSize

      newData = newData + newDataInfo


      //let data02 = toHex(newData)

      console.log("Data Size: ", newData.length)
      console.log("Data: ", newData)


      //setaddress("Wait!!!");

      //bsv.PrivateKey.fromHex
      let privateKey = bsv.PrivateKey.fromHex(homepvtKey, homenetwork);
      //let privateKey = bsv.PrivateKey.fromHexAddComp(homepvtKey, homenetwork, compState);
      privateKey.compAdd(compState);

      let changeAddExt: bsv.Address
      let changeADD = bsv.Address.fromPrivateKey(privateKey);

      if(changeAddEx.current.value.length > 10)
      {
        console.log('Change Add: ', changeAddEx.current.value)
        changeAddExt = bsv.Address.fromString(changeAddEx.current.value);
      }
      else
      {
        changeAddExt = bsv.Address.fromPrivateKey(privateKey);
      }


      privateKey = bsv.PrivateKey.fromHex(homepvtKey, homenetwork);
      //privateKey.fromHexAddComp(homepvtKey, homenetwork, compState);
  
      let provider = new DefaultProvider({network: homenetwork});

      await provider.connect()

      signer = new TestWallet(privateKey, provider)

      //Linha necessária nesta versão
      //O signee deve ser connectado
      await signer.connect(provider)

      let tx = new bsv.Transaction

      let UTXOs: bsv.Transaction.IUnspentOutput[] = []


      let utxoListOpt = ""

      utxoListOpt = utxoList.current.value; 

      //let UTXOs = await provider.listUnspent(changeADD)

      //UTXOs = await provider.listUnspent(changeADD)


      //let UTXOs = await provider.listUnspent(toADD)
      if(utxoListOpt.length === 0)
      {
        UTXOs = await provider.listUnspent(changeADD)
        //UTXOs[0].txId
      }
      else
      {
        let strR = ""
        let w1 = 'height: '
        let w2 = 'tx_pos: '
        let w3 = 'tx_hash: '
        let w4 = 'value: '
        let w5 = 'script: '
        let indexOf = utxoListOpt.indexOf(w1);
        let nextIndexOf = indexOf

        while(indexOf !== -1)
        {
          let utxos: bsv.Transaction.IUnspentOutput = {                                                    
                                                        height: 10,
                                                        outputIndex: 0,
                                                        satoshis: 0,
                                                        script: '',
                                                        txId: ""
                                                        //script: scryptlib_1.bsv.Script.buildPublicKeyHashOut(address).toHex(),
                                                      };
          
          //strR = utxoListOpt.substring(indexOf+w1.length, utxoListOpt.indexOf(',', indexOf+w1.length))
          utxos.height = parseInt(utxoListOpt.substring(indexOf+w1.length, utxoListOpt.indexOf(',', indexOf+w1.length)))
          //console.log("Var 1: ", strR);
          
          indexOf = utxoListOpt.indexOf(w2, indexOf+w1.length);
          //strR = utxoListOpt.substring(indexOf+w2.length, utxoListOpt.indexOf(',', indexOf+w2.length))
          utxos.outputIndex = parseInt(utxoListOpt.substring(indexOf+w2.length, utxoListOpt.indexOf(',', indexOf+w2.length)))
          //console.log("Var 2: ", strR);

          indexOf = utxoListOpt.indexOf(w3, indexOf+w2.length);
          //strR = utxoListOpt.substring(indexOf+w3.length, utxoListOpt.indexOf(',', indexOf+w3.length))
          utxos.txId = utxoListOpt.substring(indexOf+w3.length, utxoListOpt.indexOf(',', indexOf+w3.length))
          //console.log("Var 3: ", strR);
          
          indexOf = utxoListOpt.indexOf(w4, indexOf+w3.length);
          //strR = utxoListOpt.substring(indexOf+w4.length, utxoListOpt.indexOf(',', indexOf+w4.length))
          utxos.satoshis = parseInt(utxoListOpt.substring(indexOf+w4.length, utxoListOpt.indexOf('}', indexOf+w4.length)))
          //console.log("Value: ", strR);

          indexOf = utxoListOpt.indexOf(w5, indexOf+w4.length);
          //strR = utxoListOpt.substring(indexOf+w5.length, utxoListOpt.indexOf('}', indexOf+w5.length))
          utxos.script = utxoListOpt.substring(indexOf+w5.length, utxoListOpt.indexOf('}', indexOf+w5.length))
          //console.log("Value: ", strR);

          //É necessário apresentar o script para podermos construir o unlocking script
          //utxos.script = "76a9148c51ed42f050b1bde974fb6649e25b782d168f4088ac"
          
          //indexOf = nextIndexOf
          indexOf = utxoListOpt.indexOf(w1, indexOf+w2.length);  
          //nextIndexOf = indexOf
          //utxos2 = utxos

          UTXOs.push(utxos)            
        }

        //UTXOs = [utxos, utxos]
        //UTXOs[0].
      }

      console.log("UTXOs: ", UTXOs)

      let data = toByteString(txtData.current.value, true)
      if(hexStrFileData != '')
      {
        data = newData;
      }
      

      
      //let sendADD = bsv.Address.fromString(txtData.current.value);

      

      //Your data here
      

      //console.log("Buffer: ", sendADD.hashBuffer)
      //console.log("Buffer: ", sendADD)
      //console.log("Buffer: ", sendADD.hashBuffer)


      //let scriptDROP = 'OP_DUP OP_HASH160 ' + toHex(sendADD[0].hashBuffer) + ' OP_EQUALVERIFY OP_CHECKSIG ' + data + ' OP_DROP'

      let scriptData = 'OP_FALSE OP_RETURN ' + data
     
      /////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Jesus is the Lord
      /////////////////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Etapa para Calculo da Taxa de Rede
      /////////////////////////////////////////////////////////////////////////////////////////////////////////
          
      let tx2 = new bsv.Transaction()
      let tSatoshis = 0

      /////////////////////////////////////////////////
      //A taxa vem somente da carteira
      /////////////////////////////////////////////////
      for(let i = 0; i < UTXOs.length; i++)
      {
          tx2.from(UTXOs[i])
          tSatoshis = tSatoshis + UTXOs[i].satoshis
      }

      tSatoshis = tSatoshis - 0 //take the satoshis that will be locked from the total ammount


      tx2.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.fromASM(scriptData),
        satoshis: 0,
      }))


      //TX do ADD
      tx2.addOutput(new bsv.Transaction.Output({
        //script: bsv.Script.buildPublicKeyHashOut(changeADD),
        script: bsv.Script.buildPublicKeyHashOut(changeAddExt),
        satoshis: tSatoshis,
      }))

      tx2 = tx2.seal()
      tx2 = tx2.sign(privateKey)

         // Para o Calcula da TAXA de rede

      let rawTX = toHex(tx2)
      let feeTX;
      
      {
          feeTX = Math.floor((toHex(tx2).length/2)*0.001) + 1
      }

      console.log("TX: ", rawTX)

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Jesus is the Lord
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Etapa de Construção Final da TX
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
      
      tx2 = new bsv.Transaction()

      for(let i = 0; i < UTXOs.length; i++)
      {
          tx2.from(UTXOs[i])
      }

    
      tx2.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.fromASM(scriptData),
        satoshis: 0,
      }))


      //TX do ADD
      if((tSatoshis - feeTX) > 0)
      {
        tx2.addOutput(new bsv.Transaction.Output({
            //script: bsv.Script.buildPublicKeyHashOut(changeADD),
            script: bsv.Script.buildPublicKeyHashOut(changeAddExt),
            satoshis: tSatoshis - feeTX,
        }))
      }

      tx2 = tx2.seal().sign(privateKey)
      
      rawTX = toHex(tx2)
      
      /////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Jesus is the Lord
      /////////////////////////////////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

      console.log('\nRaw TX: ', rawTX)

      settxb(true);

      
      
      const txId = await provider.sendRawTransaction(rawTX)

      //      let TxHexBsv: string = rawTX;
      //TxHexDataSent: string = '';

      //console.log('TxId send BE: ', hash256(toHex(rawTX)))
      //console.log('TxId send LE: ', new bsv.Transaction(rawTX).id)

      //let txId = new bsv.Transaction(rawTX).id

  
      
      //console.log('TXID BC before: ', txidBC)
      //await postMessage(dataHERE);

      //console.log("TXID ASDFG: ", await broadcast(rawTX))
      //console.log('TXID BC After: ', txidBC)

      //const txId = await broadcast(rawTX, homenetwork)
   

      if(txId.length === 64)
      {

        console.log('\nTXID: ', txId)

        //let txid = "bde9bf800372a80b5896653e7f9828b518516690f6a41f51c2b4552e4de4d26d";
  
        if(homenetwork === bsv.Networks.mainnet )
        {
          txlink2 = "https://whatsonchain.com/tx/" + txId;
        }
        else if (homenetwork === bsv.Networks.testnet )
        {
          txlink2 = "https://test.whatsonchain.com/tx/" + txId;
        }

        setwaitAlert('');

        //setbalance02(0)
        setLinkUrl(txlink2);

        setTXID(txId)

        setBalance(0)
        
        setHexString('')

      }
      else

      
      {
        setwaitAlert('');
        setHexString('')
        setLinkUrl('');
        setTXID('')
        alert("Fail to Broadcast!!!");
      }
      setsendButton(true)

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

  return (

    <div className="App-header">
      <h2 style={{ fontSize: '34px', paddingBottom: '0px', paddingTop: '0px'}}>

        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          
        Write to Chain
        
      </h2>

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


      {/*
      <div>

              <div style={{ display: 'inline-block', textAlign: 'center' }}>
                <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
                    > 
                      
                      <input ref={txtData} type="text" name="PVTKEY1" min="1" placeholder="Send 2 Add" />
                    </label>     
                </div>
      </div>

      */}

      <div>
        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
          <label style={{ fontSize: '14px', paddingBottom: '0px' }}  
              > 
                 {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                 <input ref={txtData} type="text" name="PVTKEY1" min="1" placeholder="text (or file)" />
              </label>     
          </div>
      </div>

      <div>
        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
          <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
              > 
                 {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                 <input ref={utxoList} type="text" name="PVTKEY1" min="1" placeholder="UTXO List (optional)" />
              </label>     
          </div>
      </div>

      <div>
        <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
          <label style={{ fontSize: '14px', paddingBottom: '5px' }}  
              > 
                 {/* <input ref={localPvtKey} type="hex" name="PVTKEY1" min="1" defaultValue={'PVT KEY'} placeholder="hex" />*/}
                 <input ref={changeAddEx} type="text" name="PVTKEY1" min="1" placeholder="Chage Add (optional)" />
              </label>     
          </div>
      </div>


      <div>
        <div style={{ display: 'inline-block', textAlign: 'center', justifyContent: 'right', paddingBottom: '20px'}}>
            <label  style={labelStyle}>
              Select File
              <input type="file" onChange={handleFileChange} />
            </label>
            {/*selectedFile && (
                    <div>
                        <p style={{ fontSize: '12px', paddingBottom: '0px' }} >
                          {selectedFile.name}</p>
                    </div>
            )
            */}
        </div>
      </div>
      <div>
        <div >
          
            {selectedFile && (
                    <div style={{ display: 'inline-block', textAlign: 'center', justifyContent: 'right', paddingBottom: '20px'}}>
                        <p style={{ fontSize: '12px', paddingBottom: '0px' }} >
                          {selectedFile.name}</p>
                    </div>
            )}
        </div>
      </div>


      <div>
        {
          sendButton?
          <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
              
              <button className="insert" onClick={handleSendButton}
                  style={{ fontSize: '14px', paddingBottom: '0px', marginLeft: '0px'}}
              >Write</button>

          </div>
          :
          <div style={{ display: 'inline-block', textAlign: 'center', paddingBottom: '20px' }}>
              
          <button className="insert" onClick={handleSendButton}
              style={{ fontSize: '14px', paddingBottom: '0px', marginLeft: '0px'}}
          >Write</button>
          </div>
        }
      </div>

      {/*
      <div>
        <input type="file" onChange={handleFileChange} />
        {selectedFile && (
          <div>
            <p>Selected File: {"name"}</p>
            
          </div>
        )}
      </div>
      */}

      {
          txb?
          waitAlert ===''?
              <div>
                <div className="label-container" style={{ fontSize: '12px', paddingBottom: '20px', paddingTop: '0px' }}>
                  <p className="responsive-label" style={{ fontSize: '12px' }}>TXID: {txid} </p>
                </div>
                <div className="label-container" style={{ fontSize: '12px', paddingBottom: '20px', paddingTop: '0px' }}>
                  <p className="responsive-label" style={{ fontSize: '12px' }}>TX link: {' '} 
                      <a href={linkUrl} target="_blank" style={{ fontSize: '12px'}}>
                      {linkUrl}</a></p>
                </div>
              </div>
              :
              <div className="label-container" style={{ fontSize: '12px', paddingBottom: '20px', paddingTop: '0px' }}>
              <p className="responsive-label" style={{ fontSize: '12px' }}>{waitAlert} </p>
              </div>  
          :
          ""
      }           

    </div>
  );
};

export default Page02Write;