import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      console.log("User updated successfully:", user);
      queryClient.setQueryData(["user"], user);
      toast.success("Successfully updated user");
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while performing this action");
    },
  });

  return { updateUser, isUpdatingUser };
}
