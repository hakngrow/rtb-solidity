require('dotenv').config({path: '.env.setup'})

const fs = require('fs')
var Web3 = require('web3')

var WEB3_PROVIDER = 'http://' + process.env.GANACHE_HOST + ':' + process.env.GANACHE_PORT

console.log(Web3.givenProvider)

var PATH_BUILD_BIDCOIN = process.env.WEB3_BUILD_PATH + process.env.WEB3_JSON_BIDCOIN
var PATH_BUILD_BIDCOIN_CROWDSALE = process.env.WEB3_BUILD_PATH + process.env.WEB3_JSON_BIDCOIN_CROWDSALE

var BUILD_BIDCOIN
var BUILD_BIDCOIN_CROWDSALE

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


async function deployContract(contractName, contractBuild, arrArguments, addrOwner) {

    let contract = new web3.eth.Contract(JSON.parse(contractBuild.abi))

    let payload = {
        data: contractBuild.bytecode,
        arguments: arrArguments
    }

    let parameters = {
        from: addrOwner,
        gas: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    }

    await contract.deploy(payload)
        .send(parameters, (err, transactionHash) => {
            console.log(`${contractName} Transaction Hash :`, transactionHash);
        })
        .on('confirmation', () => {}).then((newContractInstance) => {
            console.log(`Deployed ${contractName} Contract Address : `, newContractInstance.options.address);
        })
}

async function deployBidCoinContract(addrOwner) {

    await deployContract('BidCoin', BUILD_BIDCOIN, [], addrOwner)
}

async function deployBidCoinCrowdsaleContract(addrOwner, wallet) {

    await deployContract(
        'BidCoinCrowdsale', 
        BUILD_BIDCOIN_CROWDSALE, 
        [web3.utils.toBN(1), wallet, CONTRACT_ADDR_BIDCOIN], 
        addrOwner)
}

async function addBidCoinMinter(addrMinter, addrOwner) {

    let contrBidCoin = await new web3.eth.Contract(JSON.parse(BUILD_BIDCOIN.abi), CONTRACT_ADDR_BIDCOIN);

    let parameters = {
        from: addrOwner,
        gas: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    }

    await contrBidCoin.methods.addMinter(addrMinter)
        .send(parameters, (err, transactionHash) => {
            console.log('addMinter Transaction Hash :', transactionHash);
        })
        .on('error', err =>{console.log(err)})
}

async function setup() {

    await initBidCoinContracts(PATH_BUILD_BIDCOIN, PATH_BUILD_BIDCOIN_CROWDSALE)

    //await deployBidCoinContract(ADDR_OWNER)
    
    //await deployBidCoinCrowdsaleContract(ADDR_OWNER, ADDR_OWNER)

    await addBidCoinMinter(CONTRACT_ADDR_BIDCOIN_CROWDSALE, ADDR_OWNER)
}

setup().catch(err =>console.log(err))
