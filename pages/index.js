import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Center, Box, FormControl, FormLabel, Input, Button, Heading } from '@chakra-ui/react'

const Card = ({ children, ...props }) => (
  <Box
    bg="white"
    w="60%"
    borderRadius={10}
    paddingX={8}
    paddingY={5}
    boxShadow="md"
    mt={2}
    display="flex"
    {...props}
  >
    {children}
  </Box>
)

const TodoItem = ({ text, id, isCompleted, onDelete }) => {
  return (
    <Card>
      <FormControl  display="flex" alignItems="center">
        <input type="checkbox" value={isCompleted}/>
        <FormLabel mb={0} ml={3} flexGrow={1}>
              <Input w="full" type="text" border="none"  value={text} />
        </FormLabel>
        <Button colorScheme="red" variant="ghost" size="sm" onClick={() => onDelete(id)}>&times;</Button>
      </FormControl>
    </Card>
  )
}

const Main = ({ todoItems }) => {
  const [items, setItems] = useState(todoItems)
  const { data: { stats } = {} } = useQuery( ['stats'],() => fetch('/api/stats').then((res) => res.json()), )
  const { mutate } = useMutation(
    data => fetch('/api/todos', { method: 'PUT', body: data }).then(({ status }) => {
        if (!/2\d\d/.test(status)) throw new Error()
      }), { onSuccess: () => {
        console.log('Updated')
        window.location.reload()
      },
      onError: error => console.error(error),
    }
  )

  const onSubmit = () => mutate({ items: items.map(item => ({ text: item.text, isCompleted: item.isCompleted })) })
  const onAdd = () => setItems([...items, { text: '', isCompleted: false }])
  const onDelete = id => setItems(items.filter((item) => item.id !== id))


  return (
      <form onSubmit={onSubmit}>
        <Center bg="orange.100" h="100vh" w="100vw" display="flex" flexDir="column">
            <Heading as="h2" size="lg" mb={4}>Total: {stats?.total}, completed: {stats?.completed}</Heading>
          {items.map((item, index) => <><TodoItem key={item.ld} {...item} index={index} onDelete={onDelete} /></>)}
            <Card justifyContent="space-between"><Button colorScheme="orange" onClick={onAdd}>Add</Button>
          <Button colorScheme="teal" type="submit">Save</Button>
            </Card>
        </Center>
      </form>
  )
}

export const getServerSideProps = async () => {
  const { prisma } = await import('lib/prisma')

  return {
    props: {
      todoItems: JSON.parse(JSON.stringify(await prisma.todoItem.findMany())),
    }
  }
}

export default Main
