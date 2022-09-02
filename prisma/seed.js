const { PrismaClient } = require('@prisma/client')
const todoItems = require('./seeds/todoItems')

const prisma = new PrismaClient()
const truncateAllTables = async () => prisma.$queryRaw/* sql */`
  TRUNCATE "TodoItem" RESTART IDENTITY CASCADE;
`

const seed = async () => {
  try {
    await truncateAllTables()
    await prisma.$transaction([
      prisma.todoItem.createMany({ data: todoItems }),
    ])
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

module.exports = seed()
