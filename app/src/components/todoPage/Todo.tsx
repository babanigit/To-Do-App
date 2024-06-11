import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

import { FormatDate } from "../../utils/FormateDates";
import { ITodoModel } from "../modal/todoModal";
import { Card } from "react-bootstrap";

import * as TodoApi from "../network/fetchApi";

// import { useAppDispatch, useAppSelector } from "../../redux/hook";
// import { deleteTodo } from "../../redux/todo/TodoSlice";

import { useState } from "react";
import { ThemeDataType } from "../../assets/theme";

interface IProps {
  todos: ITodoModel;
  onTodosClicked: (todos: ITodoModel) => void;
  onDeleteTodosClicked: (todos: ITodoModel) => void;

  theme: ThemeDataType;
  onTodosSaved: (todo: ITodoModel) => void;
}

const Todo = ({
  todos,
  onTodosClicked,
  onDeleteTodosClicked,
  theme,
  onTodosSaved,
}: IProps) => {
  //redux
  // const { currentTodos,currentSingleTodo } = useAppSelector((state) => state.todoDataInfo);
  // const dispatch = useAppDispatch();

  const [trail, setTrail] = useState<ITodoModel>(todos);

  const { title, text, createdAt, updatedAt } = todos;

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "updated: " + FormatDate(updatedAt);
  } else {
    createdUpdatedText = "created: " + FormatDate(createdAt);
  }

  async function tickFun() {
    if (trail?.todoState === false) {
      setTrail({
        ...trail,
        todoState: true,
      });
    }

    if (trail?.todoState === true) {
      setTrail({
        ...trail,
        todoState: false,
      });
    }

    console.log(" the trial is ", trail);

    const hello = await TodoApi.updateTodos(trail._id, trail);

    console.log(" the hello is ", hello);

    onTodosSaved(hello);
  }

  return (
    <>
      <Card>
        <Card.Body
          onClick={() => tickFun()}
          style={{
            backgroundColor: theme.body,
            color: theme.text,
          }}
          className=" flex justify-between rounded-lg"
        >
          <div className=" ">
            <Card.Title>{title}</Card.Title>
            <Card.Text>{text}</Card.Text>
          </div>

          <div className=" flex gap-3 place-content-center place-items-center">
            <div>
              {todos.todoState && (
                <>
                  <TiTick size={53} />
                </>
              )}
            </div>
          </div>
        </Card.Body>
        <Card.Footer className=" flex justify-between">
          <div>{createdUpdatedText}</div>

          <div>
            <div className=" flex justify-between gap-3">
              <FaEdit onClick={() => onTodosClicked(todos)} />

              <MdDelete
                onClick={async (e) => {
                  onDeleteTodosClicked(todos);
                  e.stopPropagation();
                  
                  // const confirm = window.confirm("are you sure?");
                  // if (confirm) dispatch(deleteTodo(todos._id))
                }}
              />
            </div>
          </div>
        </Card.Footer>
      </Card>
    </>
  );
};

export default Todo;
