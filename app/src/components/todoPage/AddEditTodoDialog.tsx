import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import { ITodoModel } from "../modal/todoModal";

import * as noteApi from "../network/fetchApi";

import { Modal, Form, Button } from "react-bootstrap";
import { ThemeDataType } from "../../assets/theme";

interface IAddEditTodosProps {
  todosToEdit?: ITodoModel;
  onDismiss: () => void;
  onTodosSaved: (todo: ITodoModel) => void;

  theme:ThemeDataType;
}

const AddEditTodoDialog = ({
  theme,
  todosToEdit,
  onDismiss,
  onTodosSaved,
}: IAddEditTodosProps) => {

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

      console.log(todosToEdit);
      // fetching add or edit notes
      if (todosToEdit) {
        todosResponse = await noteApi.updateTodos(todosToEdit._id, input);
      } else {
        todosResponse = await noteApi.createTodos(input);
      }

      // const noteRes = await noteApi.createNote(input);
      onTodosSaved(todosResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
      <Modal
      
      show onHide={onDismiss}>
        <Modal.Header closeButton>
          <Modal.Title>{todosToEdit ? "edit Todo" : "add Todo"}</Modal.Title>
        </Modal.Header>

        <Modal.Body
        className=" rounded-lg"
         style={{
          backgroundColor: theme.body,
          color: theme.text,
          borderColor: theme.text,
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
        <Modal.Footer>
          <button
           style={{
            backgroundColor: theme.text,
            color: theme.body,
            borderColor: theme.body,
          }}
          className=" border-2 px-3 rounded-lg"
          type="submit" form="addEditNoteForm" disabled={isSubmitting}>
            save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditTodoDialog;
