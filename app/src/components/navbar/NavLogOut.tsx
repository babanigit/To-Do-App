import { ThemeDataType } from "../../assets/theme";

interface NavBarLoggedOutViewProps {
  onRegisterClicked: () => void;
  onLoginClicked: () => void;
  theme: ThemeDataType;
}

const NavLogOut = ({
  onLoginClicked,
  onRegisterClicked,
  theme,
}: NavBarLoggedOutViewProps) => {
  return (
    <>
      <div
        className="  gap-2 flex"
      >
        <button
          style={{
            background: theme.body,
            color: theme.text,
            borderColor: theme.text,
          }}
          className=" border-2 bg--600 p-2 rounded-lg "
          onClick={onRegisterClicked}
        >
          register
        </button>
        <button
          style={{
            background: theme.body,
            color: theme.text,
            borderColor: theme.text,
          }}
          className=" border-2 bg--600 p-2 rounded-lg "
          onClick={onLoginClicked}
        >
          login
        </button>
      </div>
    </>
  );
};

export default NavLogOut;
