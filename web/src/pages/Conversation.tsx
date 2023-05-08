import { useMutation, useQuery, useQueryClient } from 'react-query'
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'

import Input from '../components/Input'
import { pb } from '../services'

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    conversationId: params.conversationId,
  }
}

type LoaderData = Awaited<ReturnType<typeof loader>>

export default function Conversations() {
  const queryClient = useQueryClient()
  const { conversationId } = useLoaderData() as LoaderData

  const { data, isLoading } = useQuery(
    ['getMessages', conversationId],
    async () => {
      return await pb.collection('messages').getFullList({
        filter: `conversation="${conversationId}"`,
        sort: 'created',
      })
    }
  )

  const { mutate: sendMessage } = useMutation(
    async ({
      message,
      conversationId,
    }: {
      message: string
      conversationId: string
    }) => {
      await pb.collection('messages').create({
        type: 'text',
        payload: message,
        conversation: conversationId,
      })

      queryClient.invalidateQueries(['getMessages', conversationId])
    }
  )

  if (isLoading || !data || !conversationId)
    return (
      <>
        <pre className="w-full py-8 text-center text-4xl">
          Loading conversation for {conversationId}
        </pre>
      </>
    )

  return (
    <>
      <ul>
        {data.map((message) => {
          return <li key={message.id}>{message.payload}</li>
        })}
      </ul>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const message = new FormData(e.currentTarget).get('message')

          sendMessage({ message: message as string, conversationId })

          e.currentTarget.reset()
        }}
      >
        <Input type="text" name="message" />
      </form>
    </>
  )
}
