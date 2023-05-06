import { useLocation, useNavigate } from 'react-router-dom'

import { pb } from '../services'

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 text-slate-700">
      <pre className="text-6xl">Hello, world</pre>
      <button
        onClick={async () => {
          pb.authStore.clear()
          navigate('/login', { state: { from: location } })
        }}
        className="flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-orange-400 focus:outline-none focus:ring focus:ring-orange-300 disabled:cursor-not-allowed disabled:bg-gray-700"
      >
        Logout
      </button>
    </main>
  )
}
