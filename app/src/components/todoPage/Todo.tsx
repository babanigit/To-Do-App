import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { FormatDate } from "../../utils/FormateDates";
import { ITodoModel } from "../modal/todoModal";
import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";

// import * as noteApi from "../network/fetchApi";

interface IProps {
  todos: ITodoModel;
  ontodosClicked: (todos: ITodoModel) => void;
  onDeleteTodosClicked: (todos: ITodoModel) => void;
  className?: string;

  // setTodoToEdit: (value: ITodoModel) => void;
  // todoToEdit: ITodoModel | null;
}

const Todo = ({
  todos,
  ontodosClicked,
  // className,
  onDeleteTodosClicked,

  // todoToEdit
  // setTodoToEdit

}: IProps) => {

  const [todoTicked, setTodoTicked] = useState<boolean>(false);

  useEffect(() => {
    async function clicked() {
      console.log(todoTicked);

      // await noteApi.updateTodos(todoToEdit._id, input);
    }

    clicked();
  }, [todoTicked]);

  const { title, text, createdAt, updatedAt } = todos;

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "updated: " + FormatDate(updatedAt);
  } else {
    createdUpdatedText = "created: " + FormatDate(createdAt);
  }

  return (
    <>
      <Card
        // className={`${styles.noteCard} ${className}`}
        onClick={() => setTodoTicked(!todoTicked)}
      >
        <Card.Body
          //  className={` ${styles.cardBody}`}
          className=" flex justify-between"
        >
          <div>
            <Card.Title
            // className={`bg-red-200 rounded-md ${styleUtils.flexCenter} `}
            >
              {title}
            </Card.Title>
            <Card.Text>{text}</Card.Text>
          </div>
          <div className=" grid justify-between">
            <FaEdit onClick={() => ontodosClicked(todos)} />

            <MdDelete
              onClick={(e) => {
                onDeleteTodosClicked(todos);
                e.stopPropagation();
              }}
              className="text-muted ms-auto"
            />
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
      </Card>
    </>
  );
};

export default Todo;
