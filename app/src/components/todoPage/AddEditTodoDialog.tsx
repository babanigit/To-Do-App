import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import { ITodoModel } from "../modal/todoModal";

import * as noteApi from "../network/fetchApi"

import { Modal, Form, Button } from "react-bootstrap";


interface IAddEditTodosProps {
  todosToEdit?: ITodoModel;
  onDismiss: () => void;
  onTodosSaved: (todo: ITodoModel) => void;
}

const AddEditTodoDialog = ({
  todosToEdit,
  onDismiss,
  onTodosSaved,
}: IAddEditTodosProps) => {

  const {
    register,
    handleSubmit,
    formState: {
       errors,
        isSubmitting },
  } = useForm<ITodoModel>({
    defaultValues: {
      todoState: todosToEdit?.todoState ,
      text: todosToEdit?.text || "",
    },
  });

  async function onSubmit(input: ITodoModel) {
    
    try {
      let noteResponse: ITodoModel;


      // fetching add or edit notes
      if (todosToEdit) {
        noteResponse = await noteApi.updateTodos(todosToEdit._id, input);
      } else {
        noteResponse = await noteApi.createTodos(input);
      }

      // const noteRes = await noteApi.createNote(input);
      onTodosSaved(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }


  return (
   <>
   
   <Modal show onHide={onDismiss}>
        <Modal.Header closeButton>
          <Modal.Title>{todosToEdit ? "edit note" : "add note"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
            
            <TextInputField
              name="todoState"
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
          <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
            save
          </Button>
        </Modal.Footer>
      </Modal>
   
   </>
  )
}

export default AddEditTodoDialog