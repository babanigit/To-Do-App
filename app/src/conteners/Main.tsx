//routing

import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as api from "../components/network/fetchApi";

// import { IUserModel } from "../components/modal/userModal";

import Navbare from "../components/navbar/Navbare";
import { Container } from "react-bootstrap";
import TodoPage from "../pages/TodoPage";
import RegisterModel from "../components/registerAndLogin/RegisterModel";
import LoginModel from "../components/registerAndLogin/LoginModel";

//redux
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
 loggedInUserRedux,
 signInFailure,
 signInStart
} from "../redux/user/UserSlice";
import { ThemeDataType } from "../assets/theme";

interface IThemeProps {
  theme:ThemeDataType
}

const Main = ({theme}:IThemeProps) => {
  // const [loggedInUser, setLoggedInUser] = useState<IUserModel | null>(null);
  const [showRegModel, setShowRegModel] = useState(false);
  const [showLogModel, setShowLogModel] = useState(false);


    //redux
    const {
      // error,
      //  loading,
         currentUser 
        } = useAppSelector(
      (state) => state.userDataInfo
    );

    const dispatch = useAppDispatch();

    
  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        dispatch(signInStart())
        
        const user = await api.getLoggedInUser();

        console.log("logged in user :  ", user);

        dispatch(loggedInUserRedux(user))
        // setLoggedInUser(user);

      } catch (error) {
        console.log(error)
        dispatch(signInFailure(error))
      }
    }

    fetchLoggedInUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbare
          // loggedInUser={loggedInUser}
          onLoginClicked={() => {
            setShowLogModel(true);
            setShowRegModel(false);
          }}
          onRegisterClicked={() => {
            setShowRegModel(true);
            setShowLogModel(false);
          }}
          // onLogoutSuccessful={() => setLoggedInUser(null)}

          theme={theme}

        />

        <Container>
          <Routes>
            <Route
              path="/"
              element={<TodoPage
                 loggedInUser={currentUser} 
                 />}
            />
          </Routes>
        </Container>

        {/* <p className="text-red-500 mt-5">
            {error && error.message}
          </p> */}
       

        {showRegModel && <div> <RegisterModel theme={theme} onRegistrationSuccessful={() => {
            // setLoggedInUser(user);
            setShowRegModel(false);
          }}/> </div>}

        {showLogModel && <div> <LoginModel  theme={theme}   onLoginSuccessful={() => {
            // setLoggedInUser(user);
            setShowLogModel(false);
          }}/> </div>}


      </BrowserRouter>
    </>
  );
};

export default Main;
