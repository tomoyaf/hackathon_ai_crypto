import {ethers} from 'hardhat'

// localnet
const ATTACH_TOKEN_ADDRESS = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'

async function main() {
  const [owner, account1, account2, ...otherAccounts] = await ethers.getSigners()
  const Token = await ethers.getContractFactory('VoiceToken')
  let token = Token.attach(ATTACH_TOKEN_ADDRESS)

  token = token.connect(account1)
  const addTx = await token.requestAddMintableItem(ethers.utils.parseEther('10'), 500, {
    value: ethers.utils.parseEther('5')
  })

  const addResult = await addTx.wait()
  const voiceId = addResult.events?.find(e => e.event === 'SuccessRequestAddItem')?.args?.[1]

  token = token.connect(owner)
  const tx2 = await token.acceptAddMintableItem(
    voiceId,
    'https://storage.googleapis.com/ai_crypto/metadata/b44ae953-378b-401e-adbf-144feb20bb9c.json'
  )

  await tx2.wait()

  token = token.connect(account2)
  const price = await token.getMintPrice(voiceId)
  console.log(price)
  const tx3 = await token.safeMint(account2.address, voiceId, {value: price})
  const result = await tx3.wait()

  console.log(result.events?.find(e => e.event === 'SuccessMinted')?.args)

  token = token.connect(owner)
  const tx4 = await token.withdraw()
  await tx4.wait()

  console.log(await owner.getBalance())
  console.log(await account1.getBalance())
  console.log(await account2.getBalance())
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
