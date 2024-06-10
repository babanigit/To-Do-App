//routing

import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import * as api from "../components/network/fetchApi";

// import { IUserModel } from "../components/modal/userModal";

import Navbare from "../components/navbar/Navbare";
import { Container } from "react-bootstrap";
import TodoPage from "../pages/TodoPage";
import RegisterModel from "../components/registerAndLogin/RegisterModel";
import LoginModel from "../components/registerAndLogin/LoginModel";

//redux
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  // loggedInUserRedux,
  // signInFailure,
  // signInStart,
  fetchLoggedInUser,
} from "../redux/user/UserSlice";
import { ThemeDataType } from "../assets/theme";

interface IThemeProps {
  theme: ThemeDataType;
}

const Main = ({ theme }: IThemeProps) => {
  // const [loggedInUser, setLoggedInUser] = useState<IUserModel | null>(null);
  const [showRegModel, setShowRegModel] = useState(false);
  const [showLogModel, setShowLogModel] = useState(false);

  //redux
  const {
    // error,
    //  loading,
    currentUser,
  } = useAppSelector((state) => state.userDataInfo);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // async function fetchLoggedInUser() {
    //   try {
    //     dispatch(signInStart());

    //     const user = await api.getLoggedInUser();

    //     console.log("logged in user :  ", user);

    //     dispatch(loggedInUserRedux(user));
    //     // setLoggedInUser(user);
    //   } catch (error) {
    //     console.log(error);
    //     dispatch(signInFailure(error));
    //   }
    // }
    // fetchLoggedInUser();

    dispatch(fetchLoggedInUser());
  }, []);

  return (
    <div
      className="min-h-screen h-auto"
      style={{
        backgroundColor: theme.body2,
        color: theme.text,
        borderColor: theme.text,
      }}
    >
      <BrowserRouter>
        <Navbare
          onLoginClicked={() => {
            setShowLogModel(true);
            setShowRegModel(false);
          }}
          onRegisterClicked={() => {
            setShowRegModel(true);
            setShowLogModel(false);
          }}
          theme={theme}
        />

        {/* <p className="text-red-500 mt-5">
            {error && error.message}
          </p> */}

        <div className="  ">
          {showRegModel && (
            <div>
              {" "}
              <RegisterModel
                theme={theme}
                onRegistrationSuccessful={() => {
                  setShowRegModel(false);
                }}
              />{" "}
            </div>
          )}

          {showLogModel && (
            <div>
              {" "}
              <LoginModel
                theme={theme}
                onLoginSuccessful={() => {
                  setShowLogModel(false);
                }}
              />{" "}
            </div>
          )}
        </div>

        {!showLogModel && !showRegModel && (
          <Container>
            <Routes>
              <Route
                path="/"
                element={<TodoPage theme={theme} loggedInUser={currentUser} />}
              />
            </Routes>
          </Container>
        )}
      </BrowserRouter>
    </div>
  );
};

export default Main;
