// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

//  function transferMoney(fromWalletId: string, toWalletId: string, amount: number) {
//   return prisma.$transaction(async (tx) => {
//     // 1. Decrement amount from the sender.
//     const sender = await tx.wallets.update({
//       data: {
//         balance: {
//           decrement: amount,
//         },
//       },
//       where: {
//         id: fromWalletId,
//       },
//     })

//     // 2. Verify that the sender's balance didn't go below zero.
//     if (sender.balance < 0) {
//       throw new Error(`Insufficient funds in wallet ${fromWalletId} to transfer ${amount}`)
//     }

//     // 2. Verify that the sender's balance didn't go below zero.
//     if (sender.balance < 0) {
//       throw new Error(`Insufficient funds in wallet ${fromWalletId} to transfer ${amount}`)
//     }

//     // 3. Increment the recipient's balance by amount
//     const recipient = await tx.wallets.update({
//       data: {
//         balance: {
//           increment: amount,
//         },
//       },
//       where: {
//         id: toWalletId,
//       },
//     })

//     return recipient
//   })
// }

// async function main() {
//   // This transfer is successful
//   await transferMoney('alice@prisma.io', 'bob@prisma.io', 100)
//   // This transfer fails because Alice doesn't have enough funds in her account
//   await transferMoney('alice@prisma.io', 'bob@prisma.io', 100)
// }

// main()
