import { useState } from "react";
import { IUserModel } from "../modal/userModal";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/UserSlice";
import { Spinner } from "react-bootstrap";

interface LoginModelProps {
  // onDismiss: () => void;
  onLoginSuccessful: (user: IUserModel) => void;
}

const LoginModel = ({ onLoginSuccessful }: LoginModelProps) => {
  const [formData, setFormData] = useState({});
  const { loading, error, currentUser } = useAppSelector(
    (state) => state.userDataInfo
  );

  const dispatch = useAppDispatch();

  console.log("from redux currentUser", currentUser)

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
      onLoginSuccessful(data);

      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <>
      <div
        // style={{ background: props.theme.body, color: props.theme.text }}
        className=" max-w-lg m-auto h-screen grid place-content-center "
      >
        <div className="  max-w-lg mx-auto   w-screen grid gap-3 p-5 ">
          <div className=" flex place-content-center place-items-center">
            <div>{/* <img className=" w-12" src={woman} alt="women" /> */}</div>

            {/* <h1 className="text-3xl text-center font-semibold ">Login</h1> */}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              //   style={{
              //     background: props.theme.body,
              //     color: props.theme.text,
              //     borderColor: props.theme.text,
              //   }}
              type="username"
              placeholder="Username"
              id="username"
              className="bg-slate-100 p-3 rounded-lg border-2"
              onChange={handleChange}
            />
            <input
              //   style={{
              //     background: props.theme.body,
              //     color: props.theme.text,
              //     borderColor: props.theme.text,
              //   }}
              type="password"
              placeholder="Password"
              id="password"
              className="bg-slate-100 p-3 rounded-lg border-2"
              onChange={handleChange}
            />
            <button
              //   style={{ background: props.theme.text, color: props.theme.body }}
              //   disabled={loading}
              className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? <Spinner /> : "Login"}
            </button>
            {/* 
            <OAuth /> */}
          </form>

          {/* <div className="flex gap-2 mt-5">
            <p>Dont Have an account?</p>
            <Link to="/signup">
              <span className="text-blue-500">Sign up</span>
            </Link>
          </div> */}

          <p className="text-red-500 mt-5">
            {error ? error.message || "Something went wrong!" : ""}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginModel;
