import { useEffect, useState } from 'react'
import { ITodoModel } from '../modal/todoModal';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import AddEditTodoDialog from './AddEditTodoDialog';
import Todo from './Todo';

import * as NotesApi from "../network/fetchApi"

const TodoPageLoggedIn = () => {

  const [todos, setTodos] = useState<ITodoModel[]>([]);

  const [showTodosLoading, setShowTodosLoading] = useState(true);
  const [showTodosLoadingError, setShowTodosLoadingError] = useState(false);

  const [showAddTodos, setShowAddTodos] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodoModel | null>(null);

  useEffect(()=>{

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
  },[showAddTodos,todoToEdit])

    // to delete note
    async function deleteTodos(todos: ITodoModel) {
      try {
        await NotesApi.deleteTodos(todos._id);
  
        // setNotes
        setTodos(todos.filter((existingTodo:ITodoModel) => existingTodo._id !== todos._id));
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  


  const todoGrid =
  <Row xs={1} md={2} xl={3}
    className={`g-4  `}
  >

    {todos.map((todos) => (
      <Col className=" p-2" key={todos._id}>
        <Todo
          todos={todos}
          // className={styles.note}
          ontodosClicked={setTodoToEdit}
          onDeleteTodosClicked={deleteTodos}
        />
      </Col>
    ))}

  </Row>

  return (
    <>
    <Button onClick={() => setShowAddTodos(true)}
                className={` bg-blue-400  `} >
                <FaPlus />
                Add new todos
            </Button>

            {showTodosLoading && <Spinner animation="border" variant="primary" />}
            {showTodosLoadingError && <p> something went wrong please refresh the page.</p>}


            {!showTodosLoading && 
            !showTodosLoadingError &&
                <>
                    {
                        todos.length > 0
                            ? todoGrid
                            : <p>you don't have any notes yet</p>
                    }
                </>
            }

{
                showAddTodos &&
                <AddEditTodoDialog
                    onDismiss={() => setShowAddTodos(false)}
                    onTodosSaved={(newTodos: ITodoModel) => {
                        setTodos([...todos, newTodos])
                        setShowAddTodos(false)
                    }}
                />
            }

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
  )
}

export default TodoPageLoggedIn