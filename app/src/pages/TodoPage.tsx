import { ThemeDataType } from "../assets/theme";
import { IUserModel } from "../components/modal/userModal";
import TodoPageLoggedIn from "../components/todoPage/TodoPageLoggedIn";

export interface ITodoPageProps {
  loggedInUser: IUserModel | null;
  theme: ThemeDataType;
}

const TodoPage = ({ loggedInUser,theme }: ITodoPageProps) => {
  return (
    <>
      <div>
        {loggedInUser ? (
          <>
            <TodoPageLoggedIn theme={theme} />
          </>
        ) : (
          <>
            <div className=" flex justify-center place-content-center ">
              Logging to get your Todo
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TodoPage;
