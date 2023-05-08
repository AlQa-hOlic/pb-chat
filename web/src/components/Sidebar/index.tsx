import { Link, useLocation } from 'react-router-dom'
import { useMediaQuery } from 'usehooks-ts'

import { ReactComponent as LogoutIcon } from '../../assets/logout.svg'
import useLogout from '../../hooks/useLogout'

interface SidebarProps {
  items: {
    href: string
    icon: React.FunctionComponent<
      React.ComponentProps<'svg'> & { title?: string }
    >
    label: string
  }[]
}

export default function Sidebar({ items }: SidebarProps) {
  const { pathname } = useLocation()
  const logout = useLogout()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
      {isMobile ? (
        <div className="fixed bottom-0 flex h-16 w-full items-center justify-center bg-white">
          <pre>Mobile Nav</pre>
        </div>
      ) : (
        <aside className="flex min-h-screen w-16 flex-col justify-between gap-4 border-r border-slate-200">
          <ul>
            {items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  to={href}
                  className={`flex justify-center p-3 text-sm font-semibold leading-6 text-slate-500 transition duration-200 ease-in focus:outline-none ${
                    pathname === href
                      ? 'text-slate-900'
                      : `${
                          href === '/' ? 'text-slate-900' : 'text-slate-500'
                        } hover:bg-slate-100 hover:text-orange-400 focus:bg-slate-100 focus:text-orange-400`
                  }`}
                >
                  <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={logout}
            className={`flex justify-center p-3 text-sm font-semibold leading-6 text-slate-500 transition duration-200 ease-in hover:bg-slate-100 hover:text-rose-400 focus:bg-slate-100 focus:text-rose-400 focus:outline-none`}
          >
            <LogoutIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="sr-only">Logout</span>
          </button>
        </aside>
      )}
    </>
  )
}
