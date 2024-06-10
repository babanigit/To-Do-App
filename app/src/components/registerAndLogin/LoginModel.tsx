import { useState } from "react";

//redux
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/UserSlice";

import { Spinner } from "react-bootstrap";
import { ThemeDataType } from "../../assets/theme";

interface LoginModelProps {
  // onDismiss: () => void;
  onLoginSuccessful: () => void;
  theme: ThemeDataType;
}

const LoginModel = ({ onLoginSuccessful, theme }: LoginModelProps) => {
  const [formData, setFormData] = useState({});

  //redux
  const { loading, error, currentUser } = useAppSelector(
    (state) => state.userDataInfo
  );
  const dispatch = useAppDispatch();

  console.log("from redux currentUser", currentUser);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("data is ", data);

      if (data.success === false) {
        console.log("login error data :-", data);
        dispatch(signInFailure(data));
        return;
      }
      onLoginSuccessful();

      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: theme.body,
          color: theme.text,
          borderColor: theme.text,
        }}
        className=" max-w-lg mt-3 m-auto h-auto grid place-content-center rounded-xl  "
      >
        <div className="  max-w-lg mx-auto   w-screen grid gap-3 p-5 ">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="username"
              placeholder="Username"
              id="username"
              className="bg-slate-100 p-3 rounded-lg border-2"
              onChange={handleChange}
              style={{
                backgroundColor: theme.body,
                color: theme.text,
                borderColor: theme.text,
              }}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="bg-slate-100 p-3 rounded-lg border-2"
              onChange={handleChange}
              style={{
                backgroundColor: theme.body,
                color: theme.text,
                borderColor: theme.text,
              }}
            />
            <button
              style={{
                backgroundColor: theme.text,
                color: theme.body,
                borderColor: theme.text,
              }}
              className=" p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? <Spinner /> : "Login"}
            </button>
            {/* 
            <OAuth /> */}
          </form>

          <p className="text-red-500 mt-5">
            {error ? error.message || "Something went wrong!" : ""}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginModel;
