import { useEffect, useState } from "react";
import { ITodoModel } from "../modal/todoModal";
import { Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import AddEditTodoDialog from "./AddEditTodoDialog";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  currentAllTodos,
  deleteTodo,
  fetchTodo,
} from "../../redux/todo/TodoSlice";
import { ThemeDataType } from "../../assets/theme";
import { FormatDate } from "../../utils/FormateDates";

interface Iprops {
  theme: ThemeDataType;
}

const TodoPageLoggedIn = ({ theme }: Iprops) => {
  const { todoLoadingError, todoLoading, currentTodos, deletedTodo } =
    useAppSelector((state) => state.todoDataInfo);
  const dispatch = useAppDispatch();

  const [todos, setTodos] = useState<ITodoModel[]>(currentTodos);
  const [showAddTodos, setShowAddTodos] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodoModel | null>(null);

  useEffect(() => {
    dispatch(fetchTodo());
  }, [showAddTodos, todoToEdit, deletedTodo]);

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen">
      
      {/* Header with Title and Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
          My Tasks
        </h1>
        <button
          onClick={() => setShowAddTodos(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{
            background: theme.text,
            color: theme.body,
          }}
        >
          <FaPlus />
          <span>Add Task</span>
        </button>
      </div>

      {/* Loading State */}
      {todoLoading && (
        <div className="flex justify-center items-center h-64">
          <Spinner
            style={{
              color: theme.text,
            }}
            animation="border"
          />
        </div>
      )}

      {/* Error State */}
      {todoLoadingError && (
        <div
          className="text-center p-4 rounded-lg"
          style={{ color: theme.text, backgroundColor: theme.body }}
        >
          Something went wrong. Please refresh the page.
        </div>
      )}

      {/* Empty State */}
      {!todoLoading && !todoLoadingError && currentTodos.length === 0 && (
        <div
          className="text-center p-8 rounded-lg"
          style={{ color: theme.text, backgroundColor: theme.body }}
        >
          <p className="mb-4">You don't have any tasks yet</p>
          <button
            onClick={() => setShowAddTodos(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: theme.text,
              color: theme.body,
            }}
          >
            <FaPlus size={12} />
            <span>Add your first task</span>
          </button>
        </div>
      )}

      {/* Todo List */}
      {!todoLoading && !todoLoadingError && currentTodos.length > 0 && (
        <div className="space-y-3">
          {currentTodos.map((todo) => (
            <div
              key={todo._id}
              className="rounded-lg shadow-sm overflow-hidden"
              style={{ backgroundColor: theme.body }}
            >
              <div
                className="p-4 flex items-start gap-4 cursor-pointer"
                onClick={() => {
                  const updatedTodo = { ...todo, todoState: !todo.todoState };
                  dispatch(
                    currentAllTodos(
                      currentTodos.map((t) =>
                        t._id === todo._id ? updatedTodo : t
                      )
                    )
                  );
                }}
              >
                {/* Checkbox */}
                <div
                  className="mt-1 rounded-full p-1 border-2 flex-shrink-0"
                  style={{ borderColor: theme.text }}
                >
                  {todo.todoState && (
                    <TiTick size={20} style={{ color: theme.text }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3
                    className={`font-medium mb-1 ${
                      todo.todoState ? "line-through opacity-60" : ""
                    }`}
                    style={{ color: theme.text }}
                  >
                    {todo.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      todo.todoState ? "line-through opacity-60" : ""
                    }`}
                    style={{ color: theme.text }}
                  >
                    {todo.text}
                  </p>
                  <p
                    className="text-xs mt-2 opacity-60"
                    style={{ color: theme.text }}
                  >
                    {todo.updatedAt > todo.createdAt
                      ? "Updated: " + FormatDate(todo.updatedAt)
                      : "Created: " + FormatDate(todo.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTodoToEdit(todo);
                    }}
                    className="p-2 rounded-lg hover:bg-black/5"
                  >
                    <FaEdit style={{ color: theme.text }} />
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure?")) {
                        dispatch(deleteTodo(todo._id));
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-black/5"
                  >
                    <MdDelete style={{ color: theme.text }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
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
    </div>
  );
};

export default TodoPageLoggedIn;
