import { useEffect, useState } from "react";
import { ITodoModel } from "../modal/todoModal";
import { Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddEditTodoDialog from "./AddEditTodoDialog";
import Todo from "./Todo";

import * as TodoApi from "../network/fetchApi";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  preLoad,
  currentAllTodos,
  loadFail,
  loadFinal,
} from "../../redux/todo/TodoSlice";
import { ThemeDataType } from "../../assets/theme";

interface Iprops {
  theme: ThemeDataType;
}

const TodoPageLoggedIn = ({ theme }: Iprops) => {
  //redux
  const { todoLoadingError, todoLoading, currentTodos, refresh } =
    useAppSelector((state) => state.todoDataInfo);
  const dispatch = useAppDispatch();

  const [todos, setTodos] = useState<ITodoModel[]>(currentTodos);

  const [showAddTodos, setShowAddTodos] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodoModel | null>(null);

  useEffect(() => {
    async function loadTodos() {
      try {
        dispatch(preLoad());

        const todos = await TodoApi.fetchTodos();

        dispatch(currentAllTodos(todos));
      } catch (error) {
        alert(error);

        dispatch(loadFail(error));
      } finally {
        dispatch(loadFinal());
      }
    }

    loadTodos();
  }, [showAddTodos, todoToEdit, refresh]);

  console.log(" current todos from redux ", currentTodos);

  // to delete note
  async function deleteTodos(todo: ITodoModel) {
    const confirm = window.confirm("are you sure?");
    try {
      if (confirm) {
        await TodoApi.deleteTodos(todo._id);

        dispatch(
          currentAllTodos(
            currentTodos.filter((existingTodo) => existingTodo._id !== todo._id)
          )
        );
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const todoGrid = (
    <Row
    // xs={1} md={2} xl={3} className={`g-4  `}
    >
      {currentTodos.map((T) => (
        <div className=" p-2" key={T._id}>
          <Todo
          theme={theme}
            todos={T}
            onTodosClicked={setTodoToEdit}
            onDeleteTodosClicked={deleteTodos}
          />
        </div>
      ))}
    </Row>
  );

  return (
    <>
      <div className=" w-full grid place-content-end p-3">
        <button
          onClick={() => setShowAddTodos(true)}
          className=" w-auto h-fit border-2 p-2 rounded-lg"
          style={{
            background: theme.text,
            color: theme.body,
            borderColor: theme.body,
          }}
        >
          <FaPlus />
        </button>
      </div>

      {/* todoLoading */}
      {todoLoading && (
        <div className=" w-full h-screen flex place-content-center ">
          <Spinner
            style={{
              color: theme.text,
            }}
            animation="border"
          />
        </div>
      )}

      {todoLoadingError && (
        <p> Something went wrong please refresh the page.</p>
      )}

      {!todoLoading && !todoLoadingError && (
        <>
          {currentTodos.length > 0 ? (
            todoGrid
          ) : (
            <p>you don't have any todos yet</p>
          )}
        </>
      )}

      {/* to add */}
      {showAddTodos && (
        <AddEditTodoDialog
        theme={theme}
          onDismiss={() => setShowAddTodos(false)}
          onTodosSaved={(newTodos: ITodoModel) => {
            setTodos([...todos, newTodos]);
            setShowAddTodos(false);
          }}
        />
      )}

      {/* to edit */}
      {todoToEdit && (
        <AddEditTodoDialog
        theme={theme}
          todosToEdit={todoToEdit}
          onDismiss={() => setTodoToEdit(null)}
          onTodosSaved={(updateTodos) => {
            setTodos(
              todos.map((existingNote) =>
                existingNote._id === updateTodos._id
                  ? updateTodos
                  : existingNote
              )
            );
            setTodoToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default TodoPageLoggedIn;
