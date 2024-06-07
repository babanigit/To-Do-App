
interface NavBarLoggedOutViewProps {
  onRegisterClicked:()=>void;
  onLoginClicked:()=>void;
}

const NavLogOut = ({onLoginClicked,onRegisterClicked}:NavBarLoggedOutViewProps) => {
  return (
    <>
    <div className="  gap-2 flex" >
    <button className=" bg-gray-600 p-2 rounded-lg "  onClick={onRegisterClicked}>register</button>
    <button className=" bg-gray-600 p-2 rounded-lg " onClick={onLoginClicked}>login</button>
    </div>
  
    </>

  )
}

export default NavLogOut