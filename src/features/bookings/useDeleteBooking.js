import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { mutate: deleteBooking, isPending: isDeleting } = useMutation({
    mutationFn: (bookingId) => deleteBookingApi(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ type: "active" });
      toast.success(`Booking successfully deleted!`);
    },
    onError: () => {
      toast.error("An error occured while deleting booking");
    },
  });
  return { deleteBooking, isPending: isDeleting };
}
