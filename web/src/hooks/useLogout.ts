import { useLocation, useNavigate } from 'react-router-dom'

import { pb } from '../services'

export default function useLogout() {
  const location = useLocation()
  const navigate = useNavigate()

  return () => {
    pb.authStore.clear()
    navigate('/login', { state: { from: location } })
  }
}
