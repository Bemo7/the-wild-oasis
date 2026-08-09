import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "all",
    defaultValues: isEditSession ? editValues : {},
  });

  const { createCabin, isCreating } = useCreateCabin();
  const { editCabin, isEditing } = useEditCabin();

  const isWorking = isSubmitting || isCreating || isEditing;

  const onSubmit = (data) => {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession) {
      editCabin(
        { newCabinData: { ...data, image: image }, id: editId },
        {
          onSuccess: (data) => {
            console.log(data);
            toast.success(`Cabin has been edited successfully.`);
            reset();
            onCloseModal?.();
          },
        },
      );
      return;
    }
    createCabin(
      { ...data, image: image },
      {
        onSuccess: (data) => {
          console.log(data);
          toast.success(`Cabin has been created successfully.`);
          reset();
          onCloseModal?.();
        },
      },
    );
  };

  const onError = (errors) => {
    console.log(errors);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : ""}
      noValidate
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "Cabin name is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            valueAsNumber: true,
            required: "Maximum capacity is required",
            min: { value: 1, message: "Maximum capacity must be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            valueAsNumber: true,
            required: "Regular price is required",
            min: { value: 1, message: "Regular price must be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          {...register("discount", {
            valueAsNumber: true,
            required: "Discount is required",
            validate: (value) =>
              value <= Number(getValues().regularPrice) ||
              "Discount must be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="text"
          id="description"
          disabled={isWorking}
          {...register("description", { required: "Description is required" })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          {...register("image", {
            required: isEditSession ? false : "Cabin photo is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        {onCloseModal && (
          <Button variation="secondary" type="reset" onClick={onCloseModal}>
            Cancel
          </Button>
        )}
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
