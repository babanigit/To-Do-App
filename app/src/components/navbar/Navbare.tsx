import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
// import { IUserModel } from "../modal/userModal";
import NavLoggedInUser from "./NavLoggedInUser";
import NavLogOut from "./NavLogOut";
import {  useAppSelector } from "../../redux/hook";
import { SetThemeContext } from "../../App";
import { useContext, useState } from "react";
import { ThemeDataType } from "../../assets/theme";

import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";





interface INavBarProps {
  // loggedInUser: IUserModel | null;
  onRegisterClicked: () => void;
  onLoginClicked: () => void;
  // onLogoutSuccessful: () => void;

  theme:ThemeDataType
}

const Navbare = ({
  // loggedInUser,
  // onLogoutSuccessful,

  onLoginClicked,
  onRegisterClicked,

  theme

}: INavBarProps) => {
  const setT = useContext(SetThemeContext);
  const [currTheme, setCurrTheme] = useState(theme.name);

  
   //redux
   const {currentUser } = useAppSelector(
    (state) => state.userDataInfo
  );

  
  function changeTheme() {
    if (currTheme === "light") {
      setT("dark");
      // localStorage.setItem("theme", "dark");
      setCurrTheme("dark");
    } else {
      setT("light");
      // localStorage.setItem("theme", "light");
      setCurrTheme("light");
    }
  }


  return (
    <div>
      <Navbar 
      style={{background:theme.body, color:theme.text}}
      variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand
                style={{background:theme.body, color:theme.text}}

          as={Link} to="/">
            Todo App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse role={""} id="main-navbar">
            <Nav>
              <Nav.Link as={Link}
                    style={{background:theme.body, color:theme.text}}
              to="/privacy">
                Privacy
              </Nav.Link>
            </Nav>
            <div
             className=" w-full bg--200 flex  justify-end gap-3 place-content-center place-items-center px-3">

              {currentUser ? (
                <NavLoggedInUser
                theme={theme}
                />
              ) : (
                <NavLogOut
                theme={theme}
                  onLoginClicked={onLoginClicked}
                  onRegisterClicked={onRegisterClicked}
                />
              )}
              
            </div
            >
            <div className=" grid text-right">
          <button
          style={{color:theme.text }}
          onClick={changeTheme}>
            {theme.name === "light" ? <MdDarkMode size={23} /> : <CiLight size={23}  />}
          </button>
        </div>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbare;
