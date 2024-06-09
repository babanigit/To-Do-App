import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { FormatDate } from "../../utils/FormateDates";
import { ITodoModel } from "../modal/todoModal";
import { Card } from "react-bootstrap";

import * as TodoApi from "../network/fetchApi";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { refereshTodo, singleTodo } from "../../redux/todo/TodoSlice";
import { useState } from "react";

interface IProps {
  todos: ITodoModel;
  onTodosClicked: (todos: ITodoModel) => void;
  onDeleteTodosClicked: (todos: ITodoModel) => void;

  // setTodoToEdit: (value: ITodoModel) => void;
  // todoToEdit: ITodoModel | null;
}

const Todo = ({ todos, onTodosClicked, onDeleteTodosClicked }: IProps) => {
  //redux
  const { currentSingleTodo } = useAppSelector((state) => state.todoDataInfo);

  const [trail, setTrail] = useState<ITodoModel | null>(null);

  const dispatch = useAppDispatch();

  const { title, text, createdAt, updatedAt } = todos;

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "updated: " + FormatDate(updatedAt);
  } else {
    createdUpdatedText = "created: " + FormatDate(createdAt);
  }

  async function tickFun() {

    dispatch(singleTodo(todos));

    console.log(currentSingleTodo!);
    console.log(currentSingleTodo!._id);

    if (currentSingleTodo?.todoState == false) {
      setTrail({
        ...currentSingleTodo,
        todoState: true,
      });
    }

    if (currentSingleTodo?.todoState == true) {
      setTrail({
        ...currentSingleTodo,
        todoState: false,
      });
    }

    console.log(" the trial is ", trail)

    // await TodoApi.updateTodos(currentSingleTodo!._id, trail!);

    // dispatch(refereshTodo(trail));
  }

  return (
    <>
      <Card
        // className={`${styles.noteCard} ${className}`}
        onClick={() => tickFun()}
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
            <FaEdit onClick={() => onTodosClicked(todos)} />

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
