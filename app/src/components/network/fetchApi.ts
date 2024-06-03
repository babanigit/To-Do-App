// import { ConflictError, UnauthorizedError } from "../error/httpError";
import { ILoginCred, IRegisterCred, IUserModel } from "../modal/userModal";

// const todoLink = "api/todos/";
const userLink = "api/users/";

// fetcher.
const fetchData = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, init);

  if (res.ok) return res;
  else {
    const errorBody = await res.json();
    const message = errorBody.message;

    throw Error(
      "request failed with status: " + res.status + " [error is] : " + message
    );
  }
};

//get logged in user
export const getLoggedInUser = async (): Promise<IUserModel> => {
  const res = await fetchData(userLink, {
    method: "GET",
  });
  console.log("from getlogged in user is : ", res);

  return res.json();
};

//get register
export const getRegisterUser = async (
  credential: IRegisterCred
): Promise<IUserModel> => {
  const res = await fetchData(userLink + "register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  });

  return res.json();
};

//get login
export const getLoginUser = async (
  Credential: ILoginCred
): Promise<IUserModel> => {
  console.log("getLoginUserFetchData ", Credential);

  const res = await fetchData(userLink + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Credential),
  });

  return res.json();
};
