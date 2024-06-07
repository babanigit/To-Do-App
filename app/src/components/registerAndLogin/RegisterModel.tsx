import { useState } from "react";
import { IUserModel } from "../modal/userModal";

interface RegisterModelProps {
  // onDismiss: () => void;
  onRegistrationSuccessful: (user: IUserModel) => void;
}

const RegisterModel = ({
  // onDismiss,
  onRegistrationSuccessful,
}: RegisterModelProps) => {
  const [formData, setFormData] = useState({});
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorData, setErrorData] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
    //   setLoading(true);
    //   setError(false);

      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

    //   setErrorData(data);
      console.log(data);

      if (data.success === false) {
        // dispatch(signInFailure(data));
        return;
      }
      onRegistrationSuccessful(data);

     
    } catch (error) {
        console.error(error)
    //   setLoading(false);
    //   setError(true);
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
            <div>{/* <img className=" w-12" src={man} alt="women" /> */}</div>

            {/* <h1 className="text-3xl text-center font-semibold ">Register</h1> */}
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
              type="email"
              placeholder="Email"
              id="email"
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
              register
              {/* {loading ? "Loading..." : "Sign Up"} */}
            </button>
            {/* <OAuth /> */}
          </form>

          <div className="flex gap-2 mt-5">
            {/* <p>Have an account?</p>
            <Link to="/signin">
              <span className="text-blue-500">Sign in</span>
            </Link>
            */}
          </div>

          {/* <p className="text-red-500 mt-5">
            {error
              ? errorData.error || "Something went wrong(from singUp.jsx)!"
              : ""}
          </p> */}
        </div>
      </div>
    </>
  );
};

export default RegisterModel;