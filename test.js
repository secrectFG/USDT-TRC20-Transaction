//导入Trc20Transaction.js
const { sendTrc20Transaction, getTrc20Balance ,getTrxBanlance} = require('./Trc20Transaction');


let myAddress = '';
let myPrivateKey = '';
let destinationAddress = '';
const amountToSend = 0.1;

//从文件mykeys.txt中读取myAddress
const fs = require('fs');

const filePath = './mykeys.json';

try {
  const data = fs.readFileSync(filePath, 'utf-8');
    const mykeys = JSON.parse(data);
    myAddress = mykeys.myAddress;
    myPrivateKey = mykeys.myPrivateKey;
    destinationAddress = mykeys.destinationAddress;
    console.log('myAddress:', myAddress);
    console.log('myPrivateKey:', myPrivateKey);
    console.log('destinationAddress:', destinationAddress);
} catch (err) {
  console.error('读取文件出错：', err);
}


// sendTrc20Transaction(myAddress, destinationAddress, amountToSend, myPrivateKey)
//     .then((r) => {
//         console.log(`Transaction sent, r: ${r}`);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

getTrc20Balance(myAddress)
    .then((balance) => {
        console.log(`USDT balance: ${balance}`);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

getTrxBanlance(myAddress).then((balance) => {
    console.log(`TRX balance: ${balance}`);
}).catch((error) => {
    console.error('Error:', error);
});