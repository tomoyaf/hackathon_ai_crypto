import {ethers} from 'hardhat'

// localnet
const ATTACH_TOKEN_ADDRESS = '0xD6d5dBABDF3F125CBfab0DDcD5bFB5c930FB45C3'

async function main() {
  const [owner, account1] = await ethers.getSigners()
  const Token = await ethers.getContractFactory('VoiceToken')
  let token = Token.attach(ATTACH_TOKEN_ADDRESS)

  token = token.connect(account1)
  const addTx = await token.requestAddMintableItem(ethers.utils.parseEther('10'), 2, 500, {
    value: ethers.utils.parseEther('5')
  })

  const addResult = await addTx.wait()
  const voiceId = addResult.events?.find(e => e.event === 'SuccessRequestAddItem')?.args?.[1]

  token = token.connect(owner)
  const tx2 = await token.acceptAddMintableItem(
    voiceId,
    'https://storage.googleapis.com/ai_crypto/metadata/b44ae953-378b-401e-adbf-144feb20bb9c.json'
  )

  const result = await tx2.wait()
  console.log(result, voiceId)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
