import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="flex h-96 min-h-screen flex-col items-center justify-center gap-6 bg-red-400 text-white">
      <h1 className="text-6xl">Oops!</h1>
      <div className="text-center text-lg opacity-90">
        <p>Sorry, an unexpected error has occurred!</p>
        {isRouteErrorResponse(error) && (
          <>
            <p>
              <i>{error.statusText}</i>
            </p>
            {error.data?.message && <p>{error.data.message}</p>}
          </>
        )}
      </div>
    </div>
  )
}
