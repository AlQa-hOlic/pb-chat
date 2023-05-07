import { ClientResponseError } from 'pocketbase'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useQueryClient } from 'react-query'

import { ReactComponent as LoadingSvg } from '../assets/loading.svg'
import { ReactComponent as PlusIcon } from '../assets/plus.svg'
import Input from '../components/Input'
import { pb } from '../services'

interface AddFriendForm {
  addFriend: string
}

export default function AddFriendSection() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState } = useForm<AddFriendForm>()

  const onAddFriend: SubmitHandler<AddFriendForm> = async ({ addFriend }) => {
    try {
      const friend = await pb
        .collection('users')
        .getFirstListItem(
          `id !='${pb.authStore.model?.id}' && (username='${addFriend}' || email='${addFriend}')`
        )

      await pb.collection('friend_requests').create({
        user: pb.authStore.model?.id,
        friend: friend.id,
      })

      queryClient.invalidateQueries([
        'friendRequestList',
        pb.authStore.model?.id,
      ])

      toast.success(
        <>
          Sent friend request to&nbsp;<b>{addFriend}</b>
        </>
      )
    } catch (e) {
      // console.log(JSON.stringify(e))
      if (e instanceof ClientResponseError && e.response?.code === 404) {
        toast.error('User not found!')
        return
      }

      if (
        e instanceof ClientResponseError &&
        e.response?.data?.friend.code === 'validation_not_unique'
      ) {
        toast.error('Friend request already sent!')
        return
      }

      toast.error('Failed to send friend request!')
    }
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-xl">Add Friend</h1>
      <form onSubmit={handleSubmit(onAddFriend)} className="flex gap-4">
        <Input
          placeholder="Enter an email or username"
          {...register('addFriend', { required: true, minLength: 1 })}
          disabled={formState.isSubmitting}
        />
        <button className="flex items-center justify-center rounded-md p-2 text-sm font-semibold leading-6 transition duration-150 ease-in-out hover:text-orange-400 focus:text-orange-400 focus:outline-none focus:ring focus:ring-orange-300 disabled:cursor-not-allowed disabled:bg-gray-500">
          {formState.isSubmitting ? (
            <LoadingSvg className="h-6 w-6 animate-spin text-orange-500" />
          ) : (
            <PlusIcon className="h-6 w-6 shrink-0" />
          )}

          <span className="sr-only">Add Friend</span>
        </button>
      </form>
    </div>
  )
}
