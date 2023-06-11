import {HardhatUserConfig} from 'hardhat/config'
import '@openzeppelin/hardhat-upgrades'
import '@nomiclabs/hardhat-waffle'

// 一旦はetherscanを使わない
// import '@nomiclabs/hardhat-etherscan'

const config: HardhatUserConfig = {
  solidity: '0.8.18'
}

export default config
