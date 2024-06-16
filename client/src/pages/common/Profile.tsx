import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

const Profile = () => {
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);
  return (
    <>
    {isAuthenticated ? (
      <div>
      Profile
      Username: {currentUser?.name}
      Email: {currentUser?.email}
    </div>
    ) : (
      <div>
        You are not signed in
      </div>
    )}
    
    </>
  )
}

export default Profile