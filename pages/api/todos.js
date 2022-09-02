import Joi from 'joi'
import { prisma } from 'lib/prisma'

const todoSchema = Joi.object({
  text: Joi.string().allow(''),
  isCompleted: Joi.boolean(),
})
const updateSchema = Joi.object({
  items: Joi.array().items(todoSchema).required(),
})

const handler = async ({ method, body }, res) => {
  try {
    if (method === 'GET') {
          const items = await prisma.todoItem.findMany()
          return res.status(200).json({ items })
    }
    if (method === 'PUT') {
      const { error, value } = updateSchema.validate(body)
      if (error) return res.status(422).json({ error: error.message })

      await prisma.$transaction([prisma.todoItem.createMany({ data: value.items }), prisma.todoItem.deleteMany()])
      return res.status(204).end()
    }
    return res.status(501).end()
  } catch (error) {
        console.error(error)
    return res.status(error.status || 500).json(error)
  }
}

export default handler
