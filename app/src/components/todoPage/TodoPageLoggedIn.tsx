import { useEffect, useState } from "react";
import { ITodoModel } from "../modal/todoModal";
import {  Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddEditTodoDialog from "./AddEditTodoDialog";
import Todo from "./Todo";

import * as TodoApi from "../network/fetchApi";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {

 preLoad,
 postLoad,
 loadFail,
 loadFinal,
} from "../../redux/todo/TodoSlice";


const TodoPageLoggedIn = () => {
//redux
const {todoLoadingError, todoLoading, error, currentTodos  } = useAppSelector(
  (state) => state.todoDataInfo
);
const dispatch = useAppDispatch();

  const [todos, setTodos] = useState<ITodoModel[] >(currentTodos);

  // const [showTodosLoading, setShowTodosLoading] = useState(true);
  // const [showTodosLoadingError, setShowTodosLoadingError] = useState(false);

  const [showAddTodos, setShowAddTodos] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodoModel | null>(null);


  useEffect(() => {

    async function loadTodos() {
      try {
        // setShowTodosLoadingError(false);
        // setShowTodosLoading(true);

        dispatch(preLoad())
        const todos = await TodoApi.fetchTodos();

        dispatch(postLoad(todos))

      } catch (error) {
        alert(error);
        // setShowTodosLoadingError(true);

        dispatch(loadFail(error))
      } finally {
        // setShowTodosLoading(false);
        dispatch(loadFinal())
      }
    }

    loadTodos();
  }, [showAddTodos, todoToEdit]);

console.log ( " current todos from redux ", currentTodos)

  // to delete note
  async function deleteTodos(todo: ITodoModel) {
    
    const confirm= window.confirm("are you sure?")
    try {
      if(confirm){
        await TodoApi.deleteTodos(todo._id);
        // setNotes
        setTodos(currentTodos.filter((existingTodo) => existingTodo._id !== todo._id));
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
      {currentTodos.map((todos) => (
        <div className=" p-2" key={todos._id}>
          <Todo
            todos={todos}

            // setTodoToEdit={setTodoToEdit}
            // todoToEdit={todoToEdit}

            // className={styles.note}
            ontodosClicked={setTodoToEdit}
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
        className=" w-auto h-fit border-2 p-2 rounded-lg bg-slate-600 text-white"
      >
        <FaPlus />
      </button>

    </div>
    

      {todoLoading && <Spinner animation="border" variant="primary" />}
      {todoLoadingError && (
        <p> something went wrong please refresh the page.</p>
      )}

      {!todoLoading && !todoLoadingError && (
        <>{currentTodos.length > 0 ? todoGrid : <p>you don't have any todos yet</p>}</>
      )}

{/* to add */}
      {showAddTodos && (
        <AddEditTodoDialog
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
