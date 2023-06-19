import {ethers, upgrades} from 'hardhat'
const UPGRADE_ADDR = '0x1252f531109e5D2121b9F518E398495bd8Cea768'

async function main() {
  const Token = await ethers.getContractFactory('VoiceToken')
  await upgrades.upgradeProxy(UPGRADE_ADDR, Token)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
