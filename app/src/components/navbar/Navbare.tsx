import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import NavLoggedInUser from "./NavLoggedInUser";
import NavLogOut from "./NavLogOut";
import { useAppSelector } from "../../redux/hook";
import { SetThemeContext } from "../../App";
import { useContext, useState } from "react";
import { ThemeDataType } from "../../assets/theme";

import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";

interface INavBarProps {
  onRegisterClicked: () => void;
  onLoginClicked: () => void;

  theme: ThemeDataType;
}

const Navbare = ({
  onLoginClicked,
  onRegisterClicked,

  theme,
}: INavBarProps) => {
  const setT = useContext(SetThemeContext);
  const [currTheme, setCurrTheme] = useState(theme.name);

  //redux
  const { currentUser } = useAppSelector((state) => state.userDataInfo);

  function changeTheme() {
    if (currTheme === "light") {
      setT("dark");
      setCurrTheme("dark");
    } else {
      setT("light");
      setCurrTheme("light");
    }
  }

  return (
    <div>
      <Navbar
        style={{ background: theme.body, color: theme.text }}
        variant="dark"
        expand="lg"
        sticky="top"
      >
        <Container>
          <Navbar.Brand
            style={{ background: theme.body, color: theme.text }}
            as={Link}
            to="/"
          >
            Todo App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse role={""} id="main-navbar">
            <div className=" w-full bg--200 flex  justify-end gap-3 place-content-center place-items-center px-3">
              {currentUser ? (
                <NavLoggedInUser theme={theme} />
              ) : (
                <NavLogOut
                  theme={theme}
                  onLoginClicked={onLoginClicked}
                  onRegisterClicked={onRegisterClicked}
                />
              )}
            </div>
            <div className=" grid text-right">
              <button style={{ color: theme.text }} onClick={changeTheme}>
                {theme.name === "light" ? (
                  <MdDarkMode size={23} />
                ) : (
                  <CiLight size={23} />
                )}
              </button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbare;
