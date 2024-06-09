import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import { FormatDate } from "../../utils/FormateDates";
import { ITodoModel } from "../modal/todoModal";
import { Card } from "react-bootstrap";

// import * as TodoApi from "../network/fetchApi";



import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
 singleTodo,
} from "../../redux/todo/TodoSlice";

interface IProps {
  todos: ITodoModel;
  onTodosClicked: (todos: ITodoModel) => void;
  onDeleteTodosClicked: (todos: ITodoModel) => void;

  // setTodoToEdit: (value: ITodoModel) => void;
  // todoToEdit: ITodoModel | null;
}

const Todo = ({
  todos,
  onTodosClicked,
  onDeleteTodosClicked,

}: IProps) => {

  //redux
const {todoLoadingError, todoLoading, error, currentTodos , refresh, currentSingleTodo  } = useAppSelector(
  (state) => state.todoDataInfo
);

const dispatch = useAppDispatch();

  const {  title, text, createdAt, updatedAt } = todos;

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "updated: " + FormatDate(updatedAt);
  } else {
    createdUpdatedText = "created: " + FormatDate(createdAt);
  }


  function tickFun() {
    
    dispatch(singleTodo(todos))
    console.log(currentSingleTodo!)

  }

  return (
    <>
      <Card
        // className={`${styles.noteCard} ${className}`}
        onClick={() => tickFun() }
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
