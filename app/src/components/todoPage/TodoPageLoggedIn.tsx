import { useEffect, useState } from "react";
import { ITodoModel } from "../modal/todoModal";
import {  Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddEditTodoDialog from "./AddEditTodoDialog";
import Todo from "./Todo";

import * as NotesApi from "../network/fetchApi";

const TodoPageLoggedIn = () => {
  const [todos, setTodos] = useState<ITodoModel[]>([]);

  const [showTodosLoading, setShowTodosLoading] = useState(true);
  const [showTodosLoadingError, setShowTodosLoadingError] = useState(false);

  const [showAddTodos, setShowAddTodos] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodoModel | null>(null);


  useEffect(() => {
    async function loadTodos() {
      try {
        setShowTodosLoadingError(false);
        setShowTodosLoading(true);

        const notes = await NotesApi.fetchTodos();

        console.log(notes);
        setTodos(notes);
      } catch (error) {
        console.error(error);
        alert(error);
        setShowTodosLoadingError(true);
      } finally {
        setShowTodosLoading(false);
      }
    }

    loadTodos();
  }, [showAddTodos, todoToEdit]);



  // to delete note
  async function deleteTodos(todo: ITodoModel) {
    
    const confirm= window.confirm("are you sure?")
    try {
      if(confirm){
        await NotesApi.deleteTodos(todo._id);
        // setNotes
        setTodos(todos.filter((existingTodo) => existingTodo._id !== todo._id));
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
      {todos.map((todos) => (
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
    

      {showTodosLoading && <Spinner animation="border" variant="primary" />}
      {showTodosLoadingError && (
        <p> something went wrong please refresh the page.</p>
      )}

      {!showTodosLoading && !showTodosLoadingError && (
        <>{todos.length > 0 ? todoGrid : <p>you don't have any notes yet</p>}</>
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
