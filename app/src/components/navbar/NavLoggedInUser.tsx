import { IUserModel } from "../modal/userModal";
import {  Navbar } from "react-bootstrap";
import * as NoteApi from "../network/fetchApi"

interface NavBarLoggedInViewProps {

  user:IUserModel,
  onLogoutSuccessful:()=>void;

}

const NavLoggedInUser = ({user,onLogoutSuccessful}:NavBarLoggedInViewProps) => {

  async function logout() {
    try {
        await NoteApi.getLogout();
        onLogoutSuccessful();

    } catch (error) {
        console.error(error)
        alert(error)
    }
}

  return (
    <>
     <Navbar.Text className="me-2">
        signed in as: {user.username}
    </Navbar.Text>
    <button
    className=" border-2 px-3 rounded-xl"
    onClick={logout}>log out</button>
    </>
  )
}

export default NavLoggedInUser