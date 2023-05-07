import { format } from 'date-fns'
import { ClientResponseError } from 'pocketbase'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { ReactComponent as IncomingReqIcon } from '../assets/incoming_req.svg'
import { ReactComponent as LoadingSvg } from '../assets/loading.svg'
import { ReactComponent as PendingReqIcon } from '../assets/pending_req.svg'
import { ReactComponent as AcceptIcon } from '../assets/tick.svg'
import { ReactComponent as RemoveIcon } from '../assets/x_mark.svg'
import { pb } from '../services'

export default function PendingRequestSection() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery(
    ['friendRequestList', pb.authStore.model?.id],
    async () => {
      return await pb.collection('friend_requests').getFullList<{
        id: string
        expand: {
          user: {
            id: string
            name: string
          }
          friend: {
            id: string
            name: string
          }
        }
      }>({
        filter: `rejected=null && accepted=null && (user="${pb.authStore.model?.id}" || friend="${pb.authStore.model?.id}")`,
        expand: 'user,friend',
      })
    }
  )

  const { mutate: cancelFriendRequest, isLoading: cancellingFriendRequest } =
    useMutation(async (id: string) => {
      await pb.collection('friend_requests').delete(id)
      queryClient.invalidateQueries([
        'friendRequestList',
        pb.authStore.model?.id,
      ])
    })

  const { mutate: rejectFriendRequest, isLoading: rejectingFriendRequest } =
    useMutation(async (id: string) => {
      await pb.collection('friend_requests').update(id, {
        rejected: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSSX'),
      })

      queryClient.invalidateQueries([
        'friendRequestList',
        pb.authStore.model?.id,
      ])
    })

  const { mutate: acceptFriendRequest, isLoading: acceptingFriendRequest } =
    useMutation(async ({ id, friendId }: { id: string; friendId: string }) => {
      try {
        await pb.collection('user_friends').create({
          user: pb.authStore.model?.id,
          friend: friendId,
          is_pinned: false,
        })

        await pb.collection('user_friends').create({
          user: friendId,
          friend: pb.authStore.model?.id,
          is_pinned: false,
        })
      } catch (e) {
        if (
          e instanceof ClientResponseError &&
          e.response?.data?.friend.code === 'validation_not_unique'
        ) {
          toast.error('User is already a friend!')
        }
      }

      await pb.collection('friend_requests').update(id, {
        accepted: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSSX'),
      })

      queryClient.invalidateQueries([
        'friendRequestList',
        pb.authStore.model?.id,
      ])
    })

  const shouldShowFriendRequests =
    !isLoading && !isError && data && data.length !== 0

  return shouldShowFriendRequests ? (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-xl">Friend Requests</h1>
      <ul className="flex flex-wrap gap-4">
        {data?.map((request) => {
          const isIncomingRequest =
            request.expand.friend.id === pb.authStore.model?.id
          return (
            <li
              key={request.id}
              className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 hover:bg-slate-100 md:w-[calc(50%-1rem)]"
            >
              <div
                className="flex gap-4"
                title={
                  isIncomingRequest ? 'Incoming Request' : 'Pending Request'
                }
              >
                {isIncomingRequest ? (
                  <IncomingReqIcon className="h-6 w-6 shrink-0 text-green-400" />
                ) : (
                  <PendingReqIcon className="h-6 w-6 shrink-0 text-yellow-400" />
                )}
                {request.expand.user.name}
              </div>
              <div className="flex gap-1">
                {isIncomingRequest ? (
                  <>
                    <button
                      title="Reject Request"
                      className="rounded-full p-1 hover:bg-slate-200 focus:bg-slate-200 focus:outline-none"
                      onClick={() => rejectFriendRequest(request.id)}
                      disabled={rejectingFriendRequest}
                    >
                      {rejectingFriendRequest ? (
                        <LoadingSvg className="h-6 w-6 animate-spin text-orange-500" />
                      ) : (
                        <RemoveIcon className="h-6 w-6 shrink-0 text-rose-400" />
                      )}
                    </button>
                    <button
                      title="Accept Request"
                      className="rounded-full p-1 hover:bg-slate-200 focus:bg-slate-200 focus:outline-none"
                      onClick={() =>
                        acceptFriendRequest({
                          id: request.id,
                          friendId: request.expand.user.id,
                        })
                      }
                      disabled={acceptingFriendRequest}
                    >
                      {acceptingFriendRequest ? (
                        <LoadingSvg className="h-6 w-6 animate-spin text-orange-500" />
                      ) : (
                        <AcceptIcon className="h-6 w-6 shrink-0 text-green-400" />
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    title="Cancel Request"
                    className="rounded-full p-1 hover:bg-slate-200 focus:bg-slate-200 focus:outline-none"
                    onClick={() => cancelFriendRequest(request.id)}
                    disabled={cancellingFriendRequest}
                  >
                    {cancellingFriendRequest ? (
                      <LoadingSvg className="h-6 w-6 animate-spin text-orange-500" />
                    ) : (
                      <RemoveIcon className="h-6 w-6 shrink-0 text-rose-400" />
                    )}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  ) : null
}
