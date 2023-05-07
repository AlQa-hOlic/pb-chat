import { animated, useTransition } from '@react-spring/web'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Outlet, useNavigation } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

export default function Root() {
  const navigation = useNavigation()
  const loadingSpinner = useTransition(navigation.state === 'loading', {
    from: {
      y: 0,
      opacity: 0,
    },
    leave: {
      y: 0,
      opacity: 0,
    },
    enter: {
      y: 16,
      opacity: 1,
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative">
        {loadingSpinner(
          (loaderProps, show) =>
            show && (
              <animated.div
                className="absolute left-1/2 z-50"
                style={loaderProps}
              >
                <svg
                  className="h-6 w-6 animate-spin text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </animated.div>
            )
        )}
        <Outlet />
      </main>
      <Toaster position="top-right" />
      <ReactQueryDevtools position="top-right" />
    </QueryClientProvider>
  )
}
