import { RouteObject } from 'react-router-dom'

import RequireAuth from './components/RouteGuards/RequireAuth'
import ErrorPage from './pages/Error'
import Home from './pages/Home'
import Login from './pages/Login'
import Root from './root'

export default [
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <Root />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },

      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
] as RouteObject[]
