import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

import { ReactComponent as LoadingSvg } from '../assets/loading.svg'
import { ReactComponent as RemoveIcon } from '../assets/x_mark.svg'
import { pb } from '../services'
import Avatar from './Avatar'

export default function ListFriendsSection() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery(
    ['friendList', pb.authStore.model?.id],
    async () => {
      return await pb.collection('user_friends').getFullList<{
        id: string
        expand: {
          friend: {
            id: string
            collectionId: string
            name: string
            avatar: string
          }
        }
      }>({
        filter: `user="${pb.authStore.model?.id}"`,
        expand: 'friend',
      })
    }
  )

  const { mutate: removeFriend, isLoading: removingFriend } = useMutation(
    async ({ friendId }: { friendId: string }) => {
      try {
        await pb
          .collection('user_friends')
          .delete(
            (
              await pb
                .collection('user_friends')
                .getFirstListItem(
                  `user="${friendId}" && friend="${pb.authStore.model?.id}"`
                )
            ).id
          )
      } catch {
        // not found!
      }

      try {
        await pb
          .collection('user_friends')
          .delete(
            (
              await pb
                .collection('user_friends')
                .getFirstListItem(
                  `friend="${friendId}" && user="${pb.authStore.model?.id}"`
                )
            ).id
          )
      } catch {
        // not found!
      }

      try {
        const friendRequests = await pb
          .collection('friend_requests')
          .getFullList({
            filter: `(user="${pb.authStore.model?.id}" && friend="${friendId}") || (friend="${pb.authStore.model?.id}" && user="${friendId}")`,
          })

        await Promise.all(
          friendRequests.map(
            async (friendRequest) =>
              await pb.collection('friend_requests').delete(friendRequest.id)
          )
        )
        const conversations = await pb
          .collection('conversations')
          .getFullList({ filter: `users ~ "${friendId}" && users:length = 2` })

        await Promise.all(
          conversations.map(
            async (conversation) =>
              await pb.collection('conversations').delete(conversation.id)
          )
        )
      } catch {
        // not found!
      }

      queryClient.invalidateQueries(['friendList', pb.authStore.model?.id])

      queryClient.invalidateQueries([
        'searchConversations',
        pb.authStore.model?.id,
        '',
      ])
    }
  )

  const shouldShowFriendsList =
    !isLoading && !isError && data && data.length !== 0

  return shouldShowFriendsList ? (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Friends</h1>
      <ul className="flex flex-wrap gap-4">
        {data?.map(({ expand: { friend } }) => {
          let avatar = friend.avatar

          if (avatar) {
            avatar =
              import.meta.env.VITE_POCKETBASE_URL +
              `/api/files/${friend.collectionId}/${friend.id}/${avatar}`
          }

          return (
            <li
              key={friend.id}
              className="w-full rounded-lg md:w-[calc(50%-1rem)]"
            >
              <Link
                to="/conversations"
                className="flex items-center justify-between gap-4 px-4 py-2 hover:bg-slate-100"
              >
                <div className="flex h-full items-center space-x-3">
                  {/* Left */}
                  <Avatar src={avatar} />
                  <span>{friend.name}</span>
                </div>
                <button
                  title="Reject Request"
                  className="rounded-full p-1 hover:bg-slate-200 focus:bg-slate-200 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault()
                    removeFriend({ friendId: friend.id })
                  }}
                  disabled={removingFriend}
                >
                  {removingFriend ? (
                    <LoadingSvg className="h-6 w-6 animate-spin text-rose-400" />
                  ) : (
                    <RemoveIcon className="h-6 w-6 shrink-0 text-rose-400" />
                  )}
                </button>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  ) : null
}
