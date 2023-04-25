const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");

//USDT转账
//fromAddress:转出地址
//toAddress:转入地址
//amount:转账金额
//privateKey:转出地址私钥
async function sendTrc20Transaction(fromAddress, toAddress, amount, 
    privateKey) {

    //先判断金额是否足够，金额不够的时候也可以发起交易，并且会消耗手续费
    const balance = await getTrc20Balance(fromAddress);
    if (balance < amount) {
        throw new Error("Insufficient balance");
    }

    //trx必须超过30个，否则可能会消耗了手续费却无法转账，这个值有可能会根据网络情况变化，30是比较保守的值一般不会超过20个
    const TRX_MIN = 30;
    const trxBalance = await getTrxBanlance(fromAddress);
    if (trxBalance < TRX_MIN) {
        throw new Error("Insufficient TRX balance");
    }

    const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    const options = {
      feeLimit: 50_000_000,
      callValue: 0
    };
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACT, 'transfer(address,uint256)', options,
      [{
        type: 'address',
        value: toAddress
      }, {
        type: 'uint256',
        value: amount * 1000000
      }],
      tronWeb.address.toHex(fromAddress)
    );
    const signedTx = await tronWeb.trx.sign(tx.transaction);
    const broadcastTx = await tronWeb.trx.sendRawTransaction(signedTx);
    const {
        message
    } = broadcastTx;
    if (message) {
        console.log("Error:", Buffer.from(message, 'hex').toString());
        return false
    }
    return true;
  }

//USDT查询
//address:查询地址
async function getTrc20Balance(address) {
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, '111');
    const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    const {
        abi
    } = await tronWeb.trx.getContract(CONTRACT);
    const contract = tronWeb.contract(abi.entrys, CONTRACT);
    const balance = await contract.methods.balanceOf(address).call();
    return parseFloat(balance) / Math.pow(10, 6);

}

async function getTrxBanlance(address) {
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    const balance = await tronWeb.trx.getBalance(address);
    return parseFloat(balance) / Math.pow(10, 6);
}

module.exports = {
    sendTrc20Transaction,
    getTrc20Balance,
    getTrxBanlance
};