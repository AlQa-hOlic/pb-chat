import { Outlet } from 'react-router-dom'

import { ReactComponent as AddFriendIcon } from '../assets/add_friend.svg'
import { ReactComponent as MessageIcon } from '../assets/messages.svg'
import { ReactComponent as Logo } from '../assets/pb_chat.svg'
import { ReactComponent as SettingsIcon } from '../assets/settings.svg'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  const items = [
    {
      href: '/',
      icon: Logo,
      label: 'PB Chat',
    },
    {
      href: '/messages',
      icon: MessageIcon,
      label: 'Messages',
    },
    {
      href: '/add_friend',
      icon: AddFriendIcon,
      label: 'Add Friend',
    },
    {
      href: '/settings',
      icon: SettingsIcon,
      label: 'Settings',
    },
  ]

  return (
    <div className="overflow-auto">
      <div className="relative flex min-h-screen min-w-[320px] items-stretch justify-stretch">
        <Sidebar items={items} />
        <Outlet />
      </div>
    </div>
  )
}
