
const Profile = () => {
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("username");
  return (
    <div>
      Profile
      Username: {name}
      Email: {email}
    </div>
  )
}

export default Profile