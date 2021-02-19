const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx').Transaction
const fs = require("fs")
const axios = require("axios")

const main = async () => {

  const infuraKey = fs.readFileSync(".infuraKey").toString().trim();

  const walletAddress = fs.readFileSync(".wallet.address").toString().trim();
  const walletPrivate = fs.readFileSync(".wallet.private").toString().trim();

  const ethGasStation = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');

  const recipients = fs.readFileSync("./recipients.txt").toString('utf-8').split("\n")

  const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${infuraKey}`))
  let nonce = await web3.eth.getTransactionCount(walletAddress, 'pending')

  Promise.all(recipients.map((recipient) => {
    if (recipient.trim().length === 42) {
      return new Promise(async (resolve) => {
        const rawTx = {
          nonce: web3.utils.toHex(nonce++),
          gasPrice: web3.utils.toHex(Math.floor(parseInt(ethGasStation.data.fast) * 10 ** 8 * 1.1)),
          to: recipient.trim(),
          gasLimit: web3.utils.toHex(21000),
          value: web3.utils.toHex(web3.utils.toWei('0.5')),
          data: '0x'
        }

        const tx = await new EthereumTx(rawTx, { chain: 'rinkeby' });
        
        tx.sign(Buffer.from(`${walletPrivate}`, 'hex'));
        
        const serializedTx = tx.serialize();

        web3.eth
          .sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('receipt', (receipt) => {
            resolve({ wallet: recipient.trim(), status: 'ok' })
          })
      })
    }
  })).then((result) => {
    console.log('Result', result)
  })
}

main();