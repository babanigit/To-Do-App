//routing

import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";


const Main = () => {
  const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);
  const [showRegModel, setShowRegModel] = useState(false);
  const [showLogModel, setShowLogModel] = useState(false);

  useEffect(()=>{

  },[])

  return (<>

  <BrowserRouter>
  
  </BrowserRouter>
  
  
  </>
  )
}

export default Main