import { pb } from '../services'
import Avatar from './Avatar'

interface TextMessageProps {
  data: {
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
  }[]
}

export default function TextMessage({ data }: TextMessageProps) {
  let avatar = data?.[0]?.expand.owner.avatar

  if (avatar) {
    avatar =
      import.meta.env.VITE_POCKETBASE_URL +
      `/api/files/${data?.[0]?.expand.owner.collectionId}/${data?.[0]?.expand.owner.id}/${avatar}`
  }

  return (
    <div
      className={`flex w-full items-start gap-4 ${
        data?.[0]?.expand.owner.id === pb.authStore.model?.id
          ? 'flex-row-reverse'
          : 'flex-row'
      }`}
    >
      <Avatar src={avatar} />
      <div className="flex flex-col space-y-2">
        {data.map(({ id, payload }) => (
          <span key={id} className="rounded-lg bg-slate-200 p-2">
            {payload}
          </span>
        ))}
      </div>
    </div>
  )
}
