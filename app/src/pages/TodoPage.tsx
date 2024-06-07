import { IUserModel } from "../components/modal/userModal";
import TodoPageLoggedIn from "../components/todoPage/TodoPageLoggedIn";

export interface ITodoPageProps {
  loggedInUser: IUserModel | null;
}

const TodoPage = ({ loggedInUser }: ITodoPageProps) => {
  return (
    <>
      <div>
        {loggedInUser ? (
          <>
            {" "}
            <TodoPageLoggedIn />{" "}
          </>
        ) : (
          <>
            {" "}
            <div className=" flex justify-center place-content-center ">
              {" "}
              You are not logged in.
            </div>{" "}
          </>
        )}
      </div>
    </>
  );
};

export default TodoPage;
