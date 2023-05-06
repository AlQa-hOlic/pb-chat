import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="flex h-96 min-h-screen flex-col items-center justify-center gap-6 bg-red-400 text-white">
      <h1 className="text-6xl">Oops!</h1>
      <div className="space-y-2 text-center text-lg opacity-90">
        <p>
          Sorry, An unexpected error has occurred!
          <br />
          {isRouteErrorResponse(error) && (
            <>
              <span>
                Error: <i>{error.statusText}</i>
              </span>
              {error.data?.message && <p>{error.data.message}</p>}
            </>
          )}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out hover:bg-red-500 focus:bg-red-500 focus:outline-none focus:ring focus:ring-red-600 disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>

            <span>Back</span>
          </button>
          <Link
            to="/"
            className="flex grow items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold leading-6 text-red-500 shadow transition duration-150 ease-in-out hover:bg-slate-200 focus:outline-none focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
