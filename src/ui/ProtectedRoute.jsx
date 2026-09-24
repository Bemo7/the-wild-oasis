import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { Navigate } from "react-router-dom";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ProtectedRoute({ children }) {
  // 1. Load authenticated user
  const { isLoadingUser, user } = useUser();

  // 2. While loading, show a spinner.
  if (isLoadingUser)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 3. If there is NO authenticated user, redirect to the /login
  if (!user) return <Navigate to={"/login"} replace />;

  // 4. If there IS a user, render the app
  return children;
}

export default ProtectedRoute;
