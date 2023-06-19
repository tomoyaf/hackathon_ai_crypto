import {ethers} from 'hardhat'

// localnet
const ATTACH_TOKEN_ADDRESS = '0x1252f531109e5D2121b9F518E398495bd8Cea768'

async function main() {
  const [owner, account1] = await ethers.getSigners()
  const Token = await ethers.getContractFactory('VoiceToken')
  let token = Token.attach(ATTACH_TOKEN_ADDRESS)

  // token.connect(owner)
  // const tx = await token.setSetting(ethers.utils.parseEther('0.3'), 100)
  // const result = await tx.wait()
  // console.log(result)

  // token = token.connect(account1)
  // const addTx = await token.requestAddMintableItem(ethers.utils.parseEther('10'), 2, 500, {
  //   value: ethers.utils.parseEther('5')
  // })

  // const addResult = await addTx.wait()
  // const voiceId = addResult.events?.find(e => e.event === 'SuccessRequestAddItem')?.args?.[1]

  // token = token.connect(owner)
  // const tx2 = await token.acceptAddMintableItem(
  //   voiceId,
  //   'https://storage.googleapis.com/ai_crypto/metadata/b44ae953-378b-401e-adbf-144feb20bb9c.json'
  // )

  // const result = await tx2.wait()

  token = token.connect(account1)
  const price = await token.getMintPrice(1)
  const tx = await token.safeMint(account1.address, 1, {value: price})
  const result = await tx.wait()
  console.log(result)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
