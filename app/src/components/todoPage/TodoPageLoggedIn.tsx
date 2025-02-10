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
  updateTodoStart,
  updateTodoSuccess,
  updateTodoFailed,
} from "../../redux/todo/TodoSlice";
import { ThemeDataType } from "../../assets/theme";
import { FormatDate } from "../../utils/FormateDates";
import * as noteApi from "../network/fetchApi";

interface Iprops {
  theme: ThemeDataType;
}

type TabType = "all" | "pending" | "completed";

const TodoPageLoggedIn = ({ theme }: Iprops) => {
  const { todoLoadingError, todoLoading, currentTodos, deletedTodo } =
    useAppSelector((state) => state.todoDataInfo);
  const dispatch = useAppDispatch();

  const [showAddTodos, setShowAddTodos] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodoModel | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  useEffect(() => {
    dispatch(fetchTodo());
  }, [showAddTodos, todoToEdit, deletedTodo, dispatch]);

  const handleToggleTodo = async (todo: ITodoModel) => {
    try {
      const updatedPayload = { completed: !todo.completed };
      dispatch(updateTodoStart());
      const updatedTodo = await noteApi.updateTodos(
        todo._id,
        updatedPayload as never
      );
      dispatch(updateTodoSuccess(updatedTodo));
      dispatch(
        currentAllTodos(
          currentTodos.map((t) => (t._id === todo._id ? updatedTodo : t))
        )
      );
    } catch (error) {
      dispatch(updateTodoFailed(error));
      console.error("Error updating todo:", error);
      alert("Error updating todo");
    }
  };

  const filteredTodos = currentTodos.filter((todo) => {
    switch (activeTab) {
      case "pending":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab ? "font-bold" : "opacity-70"
      }`}
      style={{
        background: activeTab === tab ? theme.text : "transparent",
        color: activeTab === tab ? theme.body : theme.text,
      }}
    >
      {label} (
      {
        currentTodos.filter((todo) =>
          tab === "all"
            ? true
            : tab === "completed"
            ? todo.completed
            : !todo.completed
        ).length
      }
      )
    </button>
  );

  const renderTodoList = () => {
    if (todoLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner style={{ color: theme.text }} animation="border" />
        </div>
      );
    }

    if (todoLoadingError) {
      return (
        <div
          className="text-center p-4 rounded-lg"
          style={{ color: theme.text, backgroundColor: theme.body }}
        >
          Something went wrong. Please refresh the page.
        </div>
      );
    }

    if (!filteredTodos.length) {
      return (
        <div
          className="text-center p-8 rounded-lg"
          style={{ color: theme.text, backgroundColor: theme.body }}
        >
          <p className="mb-4">No {activeTab} tasks found</p>
          {activeTab === "all" && (
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
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo._id}
            className="rounded-lg shadow-sm overflow-hidden"
            style={{ backgroundColor: theme.body }}
          >
            <div
              className="p-4 flex items-start gap-4 cursor-pointer"
              onClick={() => handleToggleTodo(todo)}
            >
              <div
                className="mt-1 rounded-full p-1 border-2 flex-shrink-0"
                style={{ borderColor: theme.text }}
              >
                {todo.completed && (
                  <TiTick size={20} style={{ color: theme.text }} />
                )}
              </div>

              <div className="flex-grow">
                <h3
                  className={`font-medium mb-1 ${
                    todo.completed ? "line-through opacity-60" : ""
                  }`}
                  style={{ color: theme.text }}
                >
                  {todo.title}
                </h3>
                <p
                  className={`text-sm ${
                    todo.completed ? "line-through opacity-60" : ""
                  }`}
                  style={{ color: theme.text }}
                >
                  {todo.text}
                </p>
                <div
                  className="flex gap-4 mt-2 text-xs opacity-60"
                  style={{ color: theme.text }}
                >
                  <span>
                    {todo.updatedAt > todo.createdAt
                      ? "Updated: " + FormatDate(todo.updatedAt)
                      : "Created: " + FormatDate(todo.createdAt)}
                  </span>
                  <span>Priority: {todo.priority}</span>
                  <span>Due: {FormatDate(todo.dueDate!)}</span>
                </div>
              </div>

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
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen">
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

      <div className="flex gap-4 mb-6">
        <TabButton tab="all" label="All" />
        <TabButton tab="pending" label="Pending" />
        <TabButton tab="completed" label="Completed" />
      </div>

      {renderTodoList()}

      {showAddTodos && (
        <AddEditTodoDialog
          theme={theme}
          onDismiss={() => setShowAddTodos(false)}
          onTodosSaved={(newTodo: ITodoModel) => {
            dispatch(currentAllTodos([...currentTodos, newTodo]));
            setShowAddTodos(false);
          }}
        />
      )}

      {todoToEdit && (
        <AddEditTodoDialog
          theme={theme}
          todosToEdit={todoToEdit}
          onDismiss={() => setTodoToEdit(null)}
          onTodosSaved={(updatedTodo) => {
            dispatch(
              currentAllTodos(
                currentTodos.map((existingTodo) =>
                  existingTodo._id === updatedTodo._id
                    ? updatedTodo
                    : existingTodo
                )
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
