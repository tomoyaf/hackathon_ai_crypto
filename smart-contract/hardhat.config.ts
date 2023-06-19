import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@openzeppelin/hardhat-upgrades'
import {HardhatUserConfig} from 'hardhat/config'

import dotenv from 'dotenv'
dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  networks: {
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [process.env.OWNER_PRIVATE_KEY || '', process.env.RECEIVER_PRIVATE_KEY || ''],
      chainId: 80001
    }
  }
}

export default config
