import {ethers, upgrades} from 'hardhat'

async function main() {
  const Token = await ethers.getContractFactory('VoiceToken')
  const token = await upgrades.deployProxy(Token)
  await token.deployed()

  console.log('Token Address:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
