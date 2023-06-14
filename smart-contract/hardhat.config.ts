import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@openzeppelin/hardhat-upgrades'
import {HardhatUserConfig} from 'hardhat/config'

const config: HardhatUserConfig = {
  solidity: '0.8.18'
}

export default config