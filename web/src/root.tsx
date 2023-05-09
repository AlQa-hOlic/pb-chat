import { animated, useTransition } from '@react-spring/web'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Outlet, useNavigation } from 'react-router-dom'

import { ReactComponent as LoadingSvg } from './assets/loading.svg'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
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
                <LoadingSvg className="h-6 w-6 animate-spin text-orange-500" />
              </animated.div>
            )
        )}
        <Outlet />
      </main>
      <Toaster position="top-right" />
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}
