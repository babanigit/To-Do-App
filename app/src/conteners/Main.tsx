//routing

import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as api from "../components/network/fetchApi";
import { IUserModel } from "../components/modal/userModal";
import Navbare from "../components/navbar/Navbare";
import { Container } from "react-bootstrap";
import TodoPage from "../pages/TodoPage";
import RegisterModel from "../components/registerAndLogin/RegisterModel";
import LoginModel from "../components/registerAndLogin/LoginModel";

const Main = () => {
  const [loggedInUser, setLoggedInUser] = useState<IUserModel | null>(null);
  const [showRegModel, setShowRegModel] = useState(false);
  const [showLogModel, setShowLogModel] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await api.getLoggedInUser();

        console.log("logged in user is:  ", user);
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLoggedInUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbare
          loggedInUser={loggedInUser}
          onLoginClicked={() => {
            setShowLogModel(true);
            setShowRegModel(false);
          }}
          onRegisterClicked={() => {
            setShowRegModel(true);
            setShowLogModel(false);
          }}
          onLogoutSuccessful={() => setLoggedInUser(null)}
        />

        <Container>
          <Routes>
            <Route
              path="/"
              element={<TodoPage loggedInUser={loggedInUser} />}
            />
          </Routes>
        </Container>

        {showRegModel && <div> <RegisterModel/> </div>}

        {showLogModel && <div> <LoginModel  onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLogModel(false);
          }}/> </div>}
      </BrowserRouter>
    </>
  );
};

export default Main;
