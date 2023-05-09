import { useId, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'

import { ReactComponent as SearchIcon } from '../assets/search.svg'
import Avatar from '../components/Avatar'
import { pb } from '../services'

interface ConversationListItemProps {
  isActive: boolean
  conversationId: string
  name: string
  avatar: string
}

function ConversationListItem({
  isActive,
  conversationId,
  name,
  avatar,
}: ConversationListItemProps) {
  return (
    <li className="select-none">
      <Link
        to={`/conversations/${conversationId}`}
        draggable={false}
        className={`flex items-start gap-4 rounded-lg p-2 hover:bg-slate-100 ${
          isActive ? 'bg-slate-100' : ''
        }`}
      >
        <Avatar src={avatar} />
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{name}</span>
          <span className="text-xs text-slate-500">
            Started a conversation{' '}
          </span>
        </div>
      </Link>
    </li>
  )
}

function useConversationsList(search: string) {
  return useQuery(
    ['searchConversations', pb.authStore.model?.id, search],
    async () => {
      const users = await pb.collection('user_friends').getFullList({
        filter: `user="${pb.authStore.model?.id}" && (friend.name ~ "${search}" || friend.username ~ "${search}" || friend.email ~ "${search}")`,
      })

      const userIds = users.map((user) => user.friend)

      const userFilter =
        userIds.length > 0
          ? '|| ' + userIds.map((userId) => `users ~ "${userId}"`).join(' || ')
          : ''

      return await pb.collection('conversations').getList<{
        id: string
        users: string[]
        alias: string
        expand: {
          users: {
            id: string
            collectionId: string
            name: string
            email: string
            username: string
            avatar: string
          }[]
        }
      }>(1, 20, {
        filter: `users ~ "${pb.authStore.model?.id}" && (alias ~ "${search}" ${userFilter})`,
        expand: 'users',
        sort: '-is_pinned',
      })
    },
    {
      cacheTime: 60 * 1000, // 1 min
      staleTime: 60 * 1000, // 1 min
    }
  )
}

function ConversationList() {
  const { pathname } = useLocation()
  const [_search, setSearch] = useState('')
  const search = useDebounce(_search, 400)
  const searchInputId = useId()

  const { data } = useConversationsList(search)

  return (
    <div
      className={`shrink-0 grow border-slate-200 p-2 lg:w-72 lg:grow-0 lg:border-r ${
        pathname === '/conversations' ? '' : 'hidden lg:block'
      }`}
    >
      <div className="flex items-center rounded-lg bg-slate-100 ring-2 ring-orange-400 ring-opacity-0 transition duration-200 ease-in focus-within:ring-opacity-50">
        <label htmlFor={searchInputId} className="pl-2">
          <SearchIcon className="h-4 w-4 shrink-0 text-slate-700" />
        </label>
        <input
          id={searchInputId}
          placeholder="Search"
          className="grow bg-transparent py-2 pl-1 pr-3 text-slate-700 focus:outline-none"
          value={_search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>
      <ul className="space-y-3 py-4">
        {data?.items.map((conversation) => {
          const otherUserIdx = conversation.users.findIndex(
            (user) => user !== pb.authStore.model?.id
          )
          const otherUser = conversation.expand.users[otherUserIdx]

          let avatar = otherUser.avatar

          if (avatar) {
            avatar =
              import.meta.env.VITE_POCKETBASE_URL +
              `/api/files/${otherUser.collectionId}/${otherUser.id}/${avatar}`
          }

          const name = conversation.alias || otherUser.name
          return (
            <ConversationListItem
              key={conversation.id}
              conversationId={conversation.id}
              isActive={pathname === `/conversations/${conversation.id}`}
              name={name}
              avatar={avatar}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default function Conversations() {
  const { pathname } = useLocation()
  return (
    <>
      <ConversationList />
      <div
        className={`flex grow ${
          pathname === '/conversations' ? 'hidden lg:block' : ''
        }`}
      >
        <Outlet />
        {pathname === '/conversations' && (
          <div className="flex h-full items-center justify-center text-slate-500">
            <h3>Select a chat or start a new conversation</h3>
          </div>
        )}
      </div>
    </>
  )
}
