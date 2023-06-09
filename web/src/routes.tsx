import { RouteObject } from 'react-router-dom'

import RequireAuth from './components/RouteGuards/RequireAuth'
import MainLayout from './layouts/Main'
import Conversation, {
  loader as conversationLoader,
} from './pages/Conversation'
import Conversations from './pages/Conversations'
import ErrorPage from './pages/Error'
import Home from './pages/Home'
import Login from './pages/Login'
import ManageFriends from './pages/ManageFriends'
import Settings from './pages/Settings'
import Root from './root'

export default [
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <Root />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
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
            path: 'conversations',
            element: (
              <RequireAuth>
                <Conversations />
              </RequireAuth>
            ),
            children: [
              {
                path: ':conversationId',
                loader: conversationLoader,
                element: (
                  <RequireAuth>
                    <Conversation />
                  </RequireAuth>
                ),
              },
            ],
          },
          {
            path: 'manage_friends',
            element: (
              <RequireAuth>
                <ManageFriends />
              </RequireAuth>
            ),
          },
          {
            path: 'settings',
            element: (
              <RequireAuth>
                <Settings />
              </RequireAuth>
            ),
          },
        ],
      },

      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
] as RouteObject[]
