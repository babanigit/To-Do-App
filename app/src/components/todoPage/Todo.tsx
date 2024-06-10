import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { FormatDate } from "../../utils/FormateDates";
import { ITodoModel } from "../modal/todoModal";
import { Card } from "react-bootstrap";

// import * as TodoApi from "../network/fetchApi";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { singleTodo } from "../../redux/todo/TodoSlice";
import { useState } from "react";
import { ThemeDataType } from "../../assets/theme";

interface IProps {
  todos: ITodoModel;
  onTodosClicked: (todos: ITodoModel) => void;
  onDeleteTodosClicked: (todos: ITodoModel) => void;

  theme: ThemeDataType;
  
}

const Todo = ({
  todos,
  onTodosClicked,
  onDeleteTodosClicked,
  theme,
}: IProps) => {
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

    console.log(" the trial is ", trail);

  }

  return (
    <>
      <Card onClick={() => tickFun()}>
        <Card.Body
          className=" flex justify-between rounded-lg"
          style={{
            backgroundColor: theme.body,
            color: theme.text,
          }}
        >
          <div>
            <Card.Title
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
            />
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
      </Card>
    </>
  );
};

export default Todo;
