import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import { useLogout } from "./useLogout";
import SpinnerMini from "../../ui/SpinnerMini";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useLogout();

  function handleLogout() {
    logout(null, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  }

  return (
    <ButtonIcon onClick={handleLogout} disabled={isLoggingOut}>
      {!isLoggingOut ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
