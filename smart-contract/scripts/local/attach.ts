import {ethers} from 'hardhat'

// localnet
const ATTACH_TOKEN_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

async function main() {
  const [owner, account1, account2, ...otherAccounts] = await ethers.getSigners()
  const Token = await ethers.getContractFactory('VoiceToken')
  const token = Token.attach(ATTACH_TOKEN_ADDRESS)

  const result = await token.tokenOfOwnerByIndex(account1.address, 1)
  // const tx = await token.safeMint(account1.address, 'https://example.com', owner.address, 1000)
  // const result = await tx.wait()

  console.log(result)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
