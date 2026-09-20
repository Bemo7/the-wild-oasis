import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBooking() {
  const params = useParams();
  const bookingId = params["id"];

  const {
    data: booking = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  return { booking, isLoading, error };
}
