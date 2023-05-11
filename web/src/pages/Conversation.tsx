import { useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { useMediaQuery } from 'usehooks-ts'

import Input from '../components/Input'
import TextMessage from '../components/TextMessage'
import { pb } from '../services'

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    conversationId: params.conversationId,
  }
}

type LoaderData = Awaited<ReturnType<typeof loader>>

export default function Conversations() {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { conversationId } = useLoaderData() as LoaderData
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { data, isLoading } = useQuery(
    ['getMessages', pb.authStore.model?.id, conversationId],
    async () => {
      const list = await pb.collection('messages').getFullList<{
        id: string
        payload: string
        type: string
        expand: {
          owner: {
            id: string
            collectionId: string
            name: string
            avatar: string
          }
        }
      }>({
        filter: `conversation="${conversationId}"`,
        sort: 'created',
        expand: 'owner',
      })

      const groupedList: {
        id: string
        payload: string
        type: string
        expand: {
          owner: {
            id: string
            collectionId: string
            name: string
            avatar: string
          }
        }
      }[][] = []

      if (list.length < 2) {
        return [list]
      }

      let lastOwner, lastMessageType, group
      lastOwner = list[0].expand.owner.id
      lastMessageType = list[0].type

      group = []
      for (let index = 0; index < list.length; index++) {
        const element = list[index]

        if (
          lastOwner === element.expand.owner.id &&
          lastMessageType === element.type
        ) {
          group.push(element)
        } else {
          groupedList.push(group)
          group = []
          group.push(element)
        }
        lastOwner = element.expand.owner.id
        lastMessageType = element.type
      }

      if (group.length != 0) {
        groupedList.push(group)
      }

      return groupedList
    },
    {
      cacheTime: 60 * 1000, // 1 min
      staleTime: 60 * 1000, // 1 min
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
      if (message.trim() === '') return
      await pb.collection('messages').create({
        type: 'text',
        payload: message,
        conversation: conversationId,
        owner: pb.authStore.model?.id,
      })

      await queryClient.invalidateQueries([
        'getMessages',
        pb.authStore.model?.id,
        conversationId,
      ])
    }
  )

  useEffect(() => {
    pb.collection('messages').subscribe('*', function () {
      queryClient.invalidateQueries([
        'getMessages',
        pb.authStore.model?.id,
        conversationId,
      ])
    })

    return () => {
      pb.collection('messages').unsubscribe('*')
    }
  }, [])

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, document.body.scrollHeight)
  }, [data])

  if (isLoading || !data || !conversationId)
    return (
      <pre className="w-full py-8 text-center text-4xl">
        Loading conversation for {conversationId}
      </pre>
    )

  return (
    <div
      className={`flex max-h-screen w-full flex-col p-4 py-6 ${
        isMobile ? 'pb-16' : 'pb-4'
      }`}
    >
      <div
        ref={chatContainerRef}
        className="custom-scrollbar mr-[10px] flex grow flex-col space-y-3 overflow-y-scroll p-4"
      >
        {data
          .filter((messages) => messages.length !== 0)
          .map((messages) => {
            return <TextMessage key={messages?.[0].id} data={messages} />
          })}
      </div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const message = new FormData(e.currentTarget).get('message')

          sendMessage({ message: message as string, conversationId })

          e.currentTarget.reset()
        }}
        className="p-2"
      >
        <Input type="text" name="message" autoComplete="off" />
      </form>
    </div>
  )
}
