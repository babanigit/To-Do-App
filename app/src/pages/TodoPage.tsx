import { ThemeDataType } from "../assets/theme";
import { IUserModel } from "../components/modal/userModal";
import TodoPageLoggedIn from "../components/todoPage/TodoPageLoggedIn";

export interface ITodoPageProps {
  loggedInUser: IUserModel | null;
  theme: ThemeDataType;
}

const TodoPage = ({ loggedInUser, theme }: ITodoPageProps) => {
  return (
    <>
      <div>
        {loggedInUser ? (
          <>
            <TodoPageLoggedIn theme={theme} />
          </>
        ) : (
          <>
            <div className=" m-5 grid justify-center place-content-center gap-3 font-extrabold ">
              <div>Log In to Add or Get your Todo</div>
              {/* <div></div>
              <div className=" font-extrabold">
                <div>note :-</div>
                Tap on the Todo for a Tick
              </div> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TodoPage;
