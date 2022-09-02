const handler = async ({ method }, res) => {
  try {
    if (method === 'GET') {
      return res.status(200).json({ stats: { total: 0, completed: 0 } })
    }
    return res.status(501).end()
  } catch (error) {
    return res.status(error.status || 500).json(error)
  }
}

export default handler
