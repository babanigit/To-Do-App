import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IUserModel } from "../modal/userModal";
import NavLoggedInUser from "./NavLoggedInUser";
import NavLogOut from "./NavLogOut";

interface INavBarProps {
  loggedInUser: IUserModel | null;
  onRegisterClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

const Navbare = ({
  loggedInUser,
  onLogoutSuccessful,

  onLoginClicked,
  onRegisterClicked,

}: INavBarProps) => {
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

              {loggedInUser ? (
                <NavLoggedInUser
                  user={loggedInUser}
                  onLogoutSuccessful={onLogoutSuccessful}
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
