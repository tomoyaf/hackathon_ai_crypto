import {ethers} from 'hardhat'

async function main() {
  const transactionSend = {
    // 送信先アドレス
    to: '0x84eD851cF3FEA4F070fD6bFc92A69a57e2a0Fcf7',
    value: ethers.utils.parseEther('100.0')
  }

  const [account] = await ethers.getSigners()
  await account.sendTransaction(transactionSend)
  console.log('success')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
