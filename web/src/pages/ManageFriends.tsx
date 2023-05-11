import AddFriendSection from '../components/AddFriendSection'
import ListFriendsSection from '../components/ListFriendsSection'
import PendingRequestSection from '../components/PendingRequestSection'

export default function ManageFriends() {
  return (
    <div className="grow space-y-8 p-8">
      <AddFriendSection />
      <PendingRequestSection />
      <ListFriendsSection />
    </div>
  )
}
