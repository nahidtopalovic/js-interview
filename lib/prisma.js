import { PrismaClient } from '@prisma/client'

export const prisma = (() => {
  if (global.prisma) return global.prisma

  global.prisma = new PrismaClient({
    log: [{ level: 'query', emit: 'event' }, 'info', 'warn', 'error'],
    errorFormat: 'pretty',
    datasources: { db: { url: process.env.DATABASE_URL } },
  })
  return global.prisma
})()
