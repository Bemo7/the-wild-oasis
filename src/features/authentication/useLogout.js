import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useLogout() {
  const queryClient = useQueryClient();
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      toast.success("User logged out successfully");
    },
    onError: (error) => {
      console.error("[X] ERROR => ", error);
      toast.error("Failed to logout user");
    },
  });

  return { logout, isLoggingOut };
}
