import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiTrash,
} from "react-icons/hi2";
import { useCheckout } from "../check-in-out/useCheckout";
import Modal from "../../ui/Modal";
import { useDeleteBooking } from "./useDeleteBooking";
import ConfirmDelete from "../../ui/ConfirmDelete";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  if (isLoading) return <Spinner />;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };
  const { status, id } = booking;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking ?? {}} />

      <ButtonGroup>
        {status == "unconfirmed" && (
          <Button
            icon={<HiArrowDownOnSquare></HiArrowDownOnSquare>}
            onClick={() => {
              navigate(`/checkin/${id}`);
            }}
          >
            Check In
          </Button>
        )}

        {status == "checked-in" && (
          <Button
            icon={<HiArrowUpOnSquare></HiArrowUpOnSquare>}
            disabled={isCheckingOut}
            onClick={() => {
              console.log("Check out booking", id);
              checkout({ bookingId: id });
            }}
          >
            Check Out
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button
              variation="danger"
              icon={<HiTrash></HiTrash>}
              disabled={isDeleting}
            >
              Delete Booking
            </Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName={`Booking #${id}`}
              onConfirm={() =>
                deleteBooking(id, {
                  onSettled: () => {
                    navigate(-1, { replace: true });
                  },
                })
              }
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
