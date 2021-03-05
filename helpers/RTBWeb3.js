const fs = require('fs')
var Web3 = require('web3')



var WEB3_PROVIDER = 'http://' + process.env.GANACHE_HOST + ':' + process.env.GANACHE_PORT

console.log(Web3.givenProvider)

var PATH_BUILD_BIDCOIN = process.env.WEB3_BUILD_PATH + process.env.WEB3_JSON_BIDCOIN
var PATH_BUILD_BIDCOIN_CROWDSALE = process.env.WEB3_BUILD_PATH + process.env.WEB3_JSON_BIDCOIN_CROWDSALE

var BUILD_BIDCOIN
var BUILD_BIDCOIN_CROWDSALE

var CONTRACT_BIDCOIN
var CONTRACT_BIDCOIN_CROWDSALE

const ADDR_OWNER = process.env.ADDR_OWNER

const CONTRACT_ADDR_BIDCOIN = process.env.CONTRACT_ADDR_BIDCOIN
const CONTRACT_ADDR_BIDCOIN_CROWDSALE = process.env.CONTRACT_ADDR_BIDCOIN_CROWDSALE


const web3 = new Web3(Web3.givenProvider || WEB3_PROVIDER)





async function getContractBuild(pathContractBuild) {

    let compiled = await JSON.parse(fs.readFileSync(pathContractBuild))
    
    return {abi: JSON.stringify(compiled.abi), bytecode: compiled.bytecode}

}

async function initBidCoinContracts(pathToBidCoinBuild, pathToBidCoinCrowdsaleBuild) {

    console.log('Using Web3 provider: ' + WEB3_PROVIDER)

    console.log('Loading BidCoin contract build: ' + pathToBidCoinBuild)
    BUILD_BIDCOIN = await getContractBuild(pathToBidCoinBuild)

    console.log('Loading BidCoinCrowdsale contract build: ' + pathToBidCoinCrowdsaleBuild)
    BUILD_BIDCOIN_CROWDSALE = await getContractBuild(pathToBidCoinCrowdsaleBuild)

    //CONTRACT_BIDCOIN = await loadContract(BUILD_BIDCOIN.abi, CONTRACT_ADDR_BIDCOIN);
    //CONTRACT_BIDCOIN_CROWDSALE = await loadContract(BUILD_BIDCOIN_CROWDSALE.abi, CONTRACT_ADDR_BIDCOIN_CROWDSALE);    
}

initBidCoinContracts(PATH_BUILD_BIDCOIN, PATH_BUILD_BIDCOIN_CROWDSALE)





async function loadContract(contractABI, contractAddress) {
    return new web3.eth.Contract(JSON.parse(contractABI), contractAddress);
}

async function getBidCoinSymbol() {

    let contrBidCoin = await loadContract(BUILD_BIDCOIN.abi, CONTRACT_ADDR_BIDCOIN);

    var symbol

    await contrBidCoin.methods.symbol()
        .call(function(err, res) {
            
            if (err) {
                console.log("An error occured", err);
                return
            }

            symbol = res
        })

    return symbol
}

async function getBidCoinRate() {

    let contrBidCoinCrowdssale = await loadContract(BUILD_BIDCOIN_CROWDSALE.abi, CONTRACT_ADDR_BIDCOIN_CROWDSALE);

    var rate

    await contrBidCoinCrowdssale.methods.rate()
        .call(function(err, res) {
            
            if (err) {
                console.log("An error occured", err);
                return
            }

            rate = res
        })

    return rate
}

async function getBidCoinDecimals() {

    let contrBidCoin = await loadContract(BUILD_BIDCOIN.abi, CONTRACT_ADDR_BIDCOIN);

    var deicmals

    await contrBidCoin.methods.decimals()
        .call(function(err, res) {
            
            if (err) {
                console.log("An error occured", err);
                return
            }

            deicmals = res
        })

    return deicmals
}

async function getBidCoinBalances(addresses) {


    let contrBidCoin = await loadContract(BUILD_BIDCOIN.abi, CONTRACT_ADDR_BIDCOIN);

    var arrBalances = []
    
    for (i = 0; i < addresses.length; i++) {

        await contrBidCoin.methods.balanceOf(addresses[i])
            .call(function(err, res) {
                
                if (err) {
                    console.log("An error occured", err);
                    return
                }

                arrBalances.push(res)
            })
            .catch(err => console.error(err))
    }

    return arrBalances
}

async function buyBidCoins(addrBuyer, valueInGWei) {

    let send = web3.eth.sendTransaction({
        from: addrBuyer,
        to: CONTRACT_ADDR_BIDCOIN_CROWDSALE, 
        value: web3.utils.toWei(valueInGWei, 'gwei'),
        gas: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    })
    .on('transactionHash', transactionHash => {
        console.log('buyBidCoins Transaction Hash :', transactionHash);
    })
    .on('error', console.error);
}

async function sendEther(addrFrom, addrTo, valueInWei) {

    let send = web3.eth.sendTransaction({
        from: addrFrom,
        to:addrTo, 
        value:web3.utils.toWei(valueInWei, "ether"),
        gas: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    })
    .on('error', console.error);
}




async function testBidCoinContract() {

    await initBidCoinContracts()
    

    getBidCoinSymbol().then(res =>console.log(res))

}

//testBidCoinContract()


function testBidCoinCrowdsaleContract() {

    let contrBidCoinCrowdsale = loadContract(BUILD_BIDCOIN_CROWDSALE.abi, CONTRACT_ADDR_BIDCOIN_CROWDSALE);

    contrBidCoinCrowdsale.methods.token().call(function(err, res) {
        if (err) {
            console.log("An error occured", err);
            return
        }
        console.log("The address is: ",res)
    })
}

//testBidCoinCrowdsaleContract()


module.exports = {

    getBidCoinSymbol: getBidCoinSymbol,
    getBidCoinDecimals: getBidCoinDecimals,
    getBidCoinRate: getBidCoinRate,
    getBidCoinBalances: getBidCoinBalances,

    buyBidCoins: buyBidCoins,
    sendEther: sendEther
}