import {ethers} from 'hardhat'

// localnet
const ATTACH_TOKEN_ADDRESS = '0xe03CbF0FF677C7B4b0C555D564bf99eFef3B0F9e'

async function main() {
  const [owner] = await ethers.getSigners()
  const Token = await ethers.getContractFactory('VoiceToken')
  const token = Token.attach(ATTACH_TOKEN_ADDRESS)

  // const result = await token.tokenOfOwnerByIndex(account1.address, 1)
  const tx = await token.safeMint(owner.address, 'https://example.com', owner.address, 1000)
  const result = await tx.wait()

  console.log(result)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
