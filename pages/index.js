import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm, useFieldArray, useFormContext, FormProvider } from 'react-hook-form'
import { Center, Box, FormControl, FormLabel, Input, Button, Heading, Text } from '@chakra-ui/react'

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

const TodoItem = ({ index, onDelete }) => {
  const { register } = useFormContext()
  const prefix = `items.${index}`
  return (
    <Card>
      <FormControl id={`${prefix}.isCompleted`} display="flex" alignItems="center" outlineWidth={0}>
        <input type="checkbox" {...register(`${prefix}.isCompleted`)} />
        <FormLabel mb={0} ml={3} flexGrow={1}>
              <Input w="full" type="text" {...register(`${prefix}.text`)} border="none" />
        </FormLabel>
        <Button colorScheme="red" variant="ghost" size="sm" onClick={() => onDelete(index)}>&times;</Button>
      </FormControl>
    </Card>
  )
}

const Main = ({ todoItems }) => {
  const methods = useForm({ defaultValues: { items: todoItems } })
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'items' })
  const { data: { stats } = {} } = useQuery(['stats'], () => fetch('/api/stats').then((res) => res.json()))
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

  const onSubmit = ({ items }) => mutate({ items: items.map(item => ({ text: item.text, isCompleted: item.isCompleted })) })
  const onAdd = () => append({ text: '' })
  const onDelete = index => remove(index)

  return (
    <FormProvider {...methods}>
      <form
      onSubmit={methods.handleSubmit(onSubmit)}>
        <Center bg="orange.100" h="100vh" w="100vw" display="flex" flexDir="column">
            <Heading as="h2" size="lg" mb={4}>Total: {stats?.total}, completed: {stats?.completed}</Heading>
          {fields.map((item, index) => <><TodoItem key={item.ld} {...item} index={index} onDelete={onDelete} /></>)}
            <Card justifyContent="space-between"><Button colorScheme="orange" onClick={onAdd}>Add</Button>
          <Button colorScheme="teal" type="submit">Save</Button>
            </Card>
        </Center>
        </form>
    </FormProvider>
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
