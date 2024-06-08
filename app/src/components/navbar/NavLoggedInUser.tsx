import {  Navbar } from "react-bootstrap";
import * as NoteApi from "../network/fetchApi"
import { useAppDispatch, useAppSelector } from "../../redux/hook";

import {
  
  signOut,
 } from "../../redux/user/UserSlice";



const NavLoggedInUser = () => {
   //redux
   const {currentUser } = useAppSelector(
    (state) => state.userDataInfo
  );
  const dispatch = useAppDispatch();



  async function logout() {
    try {
        await NoteApi.getLogout();
        
        dispatch(signOut())

    } catch (error) {
        console.error(error)
        alert(error)
    }
}

  return (
    <>
     <Navbar.Text className="me-2">
        signed in as: {currentUser!.username}
    </Navbar.Text>
    <button
    className=" border-2 px-3 rounded-xl"
    onClick={logout}>log out</button>
    </>
  )
}

export default NavLoggedInUser