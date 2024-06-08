import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
// import { IUserModel } from "../modal/userModal";
import NavLoggedInUser from "./NavLoggedInUser";
import NavLogOut from "./NavLogOut";
import {  useAppSelector } from "../../redux/hook";


interface INavBarProps {
  // loggedInUser: IUserModel | null;
  onRegisterClicked: () => void;
  onLoginClicked: () => void;
  // onLogoutSuccessful: () => void;
}

const Navbare = ({
  // loggedInUser,
  // onLogoutSuccessful,

  onLoginClicked,
  onRegisterClicked,

}: INavBarProps) => {
  
   //redux
   const {currentUser } = useAppSelector(
    (state) => state.userDataInfo
  );

  return (
    <div>
      <Navbar bg="secondary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Todo App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse role={""} id="main-navbar">
            <Nav>
              <Nav.Link as={Link} to="/privacy">
                Privacy
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">

              {currentUser ? (
                <NavLoggedInUser
                  // user={currentUser}
                  // onLogoutSuccessful={onLogoutSuccessful}
                />
              ) : (
                <NavLogOut
                  onLoginClicked={onLoginClicked}
                  onRegisterClicked={onRegisterClicked}
                />
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbare;
