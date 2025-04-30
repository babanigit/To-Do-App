// import { ConflictError, UnauthorizedError } from "../error/httpError";
import { ITodoModel } from "../modal/todoModal";
import {
  ILoginCred,
  IRegisterCred,
  IUserError,
  IUserModel,
} from "../modal/userModal";

// coupled and decoupled urls
let userLink = "api/users/";
let todoLink = "api/todos/";

const apiUrlUsers: string =
  import.meta.env.VITE_BACKEND_API_URL + "/api/users/";
const apiUrlTodo: string = import.meta.env.VITE_BACKEND_API_URL + "/api/todos/";
const decoupled: string = import.meta.env.VITE_DECOUPLED;
if (decoupled == "true") {
  userLink = apiUrlUsers;
  todoLink = apiUrlTodo;
}

// fetcher.
const fetchData = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, {
    ...init,
    credentials: "include", // ✅ This is required to send cookies!
  });

  if (res.ok) return res;
  else {
    const errorBody: IUserError = await res.json();
    const message = errorBody.message;
    throw new Error(message);
  }
};

//get logged in user
export const getLoggedInUser = async (): Promise<IUserModel> => {
  const res = await fetchData(userLink, {
    method: "GET",
  });

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

// get logout
export async function getLogout() {
  await fetchData(userLink + "logout", { method: "POST" });
}

// NOTOS

// fetch notes
export async function fetchTodos(): Promise<ITodoModel[]> {
  const res = await fetchData(todoLink, {
    method: "GET",
  });
  return await res.json();
}

// fetch notes
export async function getTodo(noteId: string): Promise<ITodoModel[]> {
  const res = await fetchData(todoLink + noteId, {
    method: "GET",
  });
  return await res.json();
}

// to create note
export async function createTodos(note: ITodoModel): Promise<ITodoModel> {
  const res = await fetchData(todoLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return res.json();
}

// update notes
export async function updateTodos(
  noteId: string,
  note: ITodoModel
): Promise<ITodoModel> {
  const res = await fetchData(todoLink + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  return res.json();
}

//tick todo
export async function tickTodo(
  noteId: string,
  note: ITodoModel
): Promise<ITodoModel> {
  const res = await fetchData(todoLink + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  return res.json();
}

// delete note
export async function deleteTodos(noteId: string) {
  await fetchData(todoLink + noteId, { method: "DELETE" });
}
