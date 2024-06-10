import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import { ITodoModel } from "../modal/todoModal";

import * as noteApi from "../network/fetchApi";

import { Modal, Form } from "react-bootstrap";
import { ThemeDataType } from "../../assets/theme";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  updateTodoFailed,
  updateTodoStart,
  updateTodoSuccess,
} from "../../redux/todo/TodoSlice";

interface IAddEditTodosProps {
  todosToEdit?: ITodoModel;
  onDismiss: () => void;
  onTodosSaved: (todo: ITodoModel) => void;

  theme: ThemeDataType;
}

const AddEditTodoDialog = ({
  theme,
  todosToEdit,
  onDismiss,
  onTodosSaved,
}: IAddEditTodosProps) => {
  //redux
  const { error } = useAppSelector((state) => state.todoDataInfo);

  const dispatch = useAppDispatch();

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ITodoModel>({
    defaultValues: {
      title: todosToEdit?.title || "",
      text: todosToEdit?.text || "",
    },
  });

  async function onSubmit(input: ITodoModel) {
    try {
      let todosResponse: ITodoModel;

      dispatch(updateTodoStart());
      console.log(todosToEdit);
      // fetching add or edit notes
      if (todosToEdit) {
        todosResponse = await noteApi.updateTodos(todosToEdit._id, input);
      } else {
        todosResponse = await noteApi.createTodos(input);
      }

      dispatch(updateTodoSuccess(todosResponse));
      // const noteRes = await noteApi.createNote(input);
      onTodosSaved(todosResponse);
    } catch (error) {
      dispatch(updateTodoFailed(error));
      console.error(error);
      alert(error);
    }

    console.log(" todo error ", error)
  }

  return (
    <>
      <Modal show onHide={onDismiss}>
        <Modal.Header
         
          closeButton
        >
          <Modal.Title>{todosToEdit ? "edit Todo" : "add Todo"}</Modal.Title>
          {error && error.message}
        </Modal.Header>

        <Modal.Body
          className=" rounded-lg m-1"
          style={{
            backgroundColor: theme.body,
            color: theme.text,
          }}
        >
          <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
            <TextInputField
              name="title"
              label="Title"
              register={register}
              registerOptions={{ required: "Required todoState" }}
              error={errors.todoState}
              type="text"
              placeholder="Title"
            />

            <TextInputField
              name="text"
              label="Text"
              as="textarea"
              rows={5}
              placeholder="Text"
              register={register}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer
        //  style={{
        //   backgroundColor: theme.body2,
        //   color: theme.text,
        //   borderColor: theme.text,
        // }}
        >
          <button
            style={{
              backgroundColor: theme.text,
              color: theme.body,
              borderColor: theme.body,
            }}
            className=" border-2 px-3 rounded-lg"
            type="submit"
            form="addEditNoteForm"
            disabled={isSubmitting}
          >
            save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditTodoDialog;
