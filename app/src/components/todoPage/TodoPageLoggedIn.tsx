import { useEffect, useState } from 'react'
import { ITodoModel } from '../modal/todoModal';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import AddEditTodoDialog from './AddEditTodoDialog';
import Todo from './Todo';

const TodoPageLoggedIn = () => {

  const [todos, setTodos] = useState<ITodoModel[]>([]);

  const [showTodosLoading, setShowTodosLoading] = useState(true);
  const [showTodosLoadingError, setShowTodosLoadingError] = useState(false);

  const [showAddTodos, setShowAddTodos] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodoModel | null>(null);

  useEffect(()=>{

  },[])


  const todoGrid =
  <Row xs={1} md={2} xl={3}
    className={`g-4 ${styles.notesGrid} `}
  >

    {todos.map((note) => (
      <Col className=" p-2" key={note._id}>
        <Todo
          todos={todos}
          className={styles.note}
          onNoteClicked={setNoteToEdit}
          onDeleteNoteClicked={deleteNote}
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
                    onNoteSaved={(newNote) => {
                        setTodos([...todos, newNote])
                        setShowAddTodos(false)
                    }}
                />
            }

    </>
  )
}

export default TodoPageLoggedIn