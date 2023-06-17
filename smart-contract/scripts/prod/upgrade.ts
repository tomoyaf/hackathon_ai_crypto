import {ethers, upgrades} from 'hardhat'
const UPGRADE_ADDR = '0xe03CbF0FF677C7B4b0C555D564bf99eFef3B0F9e'

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
