import AddFriendSection from '../components/AddFriendSection'
import PendingRequestSection from '../components/PendingRequestSection'

export default function ManageFriends() {
  return (
    <div className="grow">
      <AddFriendSection />
      <PendingRequestSection />
    </div>
  )
}
