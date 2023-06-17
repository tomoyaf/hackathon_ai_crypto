import {ethers, upgrades} from 'hardhat'
const UPGRADE_ADDR = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

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
