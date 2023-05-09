import placeholderImg from '../assets/placeholder.jpg'

interface AvatarProps {
  src: string
}

export default function Avatar({ src }: AvatarProps) {
  const isActive = true
  return (
    <div className="relative inline-flex select-none">
      <div className="relative h-9 w-9 overflow-hidden rounded-full md:h-11 md:w-11">
        <img src={src || placeholderImg} alt="Avatar" draggable={false} />
      </div>
      {isActive ? (
        <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white md:h-3 md:w-3" />
      ) : null}
    </div>
  )
}
