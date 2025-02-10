import { useForm } from "react-hook-form";
import { ITodoModel } from "../modal/todoModal";
import * as noteApi from "../network/fetchApi";
import { Modal } from "react-bootstrap";
import { ThemeDataType } from "../../assets/theme";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  updateTodoFailed,
  updateTodoStart,
  updateTodoSuccess,
} from "../../redux/todo/TodoSlice";
import { FiCalendar, FiFlag, FiX } from "react-icons/fi";

interface IAddEditTodosProps {
  todosToEdit?: ITodoModel;
  onDismiss: () => void;
  onTodosSaved: (todo: ITodoModel) => void;
  theme: ThemeDataType;
}

const priorities = [
  { value: "Low", color: "#4CAF50" },
  { value: "Medium", color: "#FF9800" },
  { value: "High", color: "#f44336" },
];

const AddEditTodoDialog = ({
  theme,
  todosToEdit,
  onDismiss,
  onTodosSaved,
}: IAddEditTodosProps) => {
  const { error } = useAppSelector((state) => state.todoDataInfo);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ITodoModel>({
    defaultValues: {
      title: todosToEdit?.title || "",
      text: todosToEdit?.text || "",
      dueDate: todosToEdit?.dueDate 
        ? new Date(todosToEdit.dueDate).toISOString().split('T')[0]
        : "",
      priority: todosToEdit?.priority || "Medium",
    },
  });

  const watchPriority = watch("priority");

  async function onSubmit(input: ITodoModel) {
    try {
      let todosResponse: ITodoModel;
      dispatch(updateTodoStart());

      if (todosToEdit) {
        todosResponse = await noteApi.updateTodos(todosToEdit._id, input);
      } else {
        todosResponse = await noteApi.createTodos(input);
      }

      dispatch(updateTodoSuccess(todosResponse));
      onTodosSaved(todosResponse);
    } catch (error) {
      dispatch(updateTodoFailed(error));
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss} centered>
      <div className="p-6 rounded-lg" style={{ backgroundColor: theme.body }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 
            className="text-xl font-semibold"
            style={{ color: theme.text }}
          >
            {todosToEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onDismiss}
            className="p-2 rounded-full hover:bg-black/5"
          >
            <FiX size={20} style={{ color: theme.text }} />
          </button>
        </div>

        {error && (
          <div 
            className="mb-4 p-3 rounded-lg bg-red-100 text-red-600"
            style={{ borderColor: theme.text }}
          >
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Input */}
          <div>
            <label 
              className="block mb-1 font-medium"
              style={{ color: theme.text }}
            >
              Title
            </label>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              className="w-full p-2 rounded-lg border"
              style={{
                backgroundColor: theme.body,
                color: theme.text,
                borderColor: theme.text,
              }}
              placeholder="What needs to be done?"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label
              className="block mb-1 font-medium"
              style={{ color: theme.text }}
            >
              Description
            </label>
            <textarea
              {...register("text", {
                required: "Description is required",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters",
                },
              })}
              rows={4}
              className="w-full p-2 rounded-lg border resize-none"
              style={{
                backgroundColor: theme.body,
                color: theme.text,
                borderColor: theme.text,
              }}
              placeholder="Add more details about this task..."
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-500">
                {errors.text.message}
              </p>
            )}
          </div>

          {/* Priority and Due Date Row */}
          <div className="flex gap-4">
            {/* Priority Select */}
            <div className="flex-1">
              <label
                className="block mb-1 font-medium"
                style={{ color: theme.text }}
              >
                <div className="flex items-center gap-2">
                  <FiFlag />
                  Priority
                </div>
              </label>
              <select
                {...register("priority")}
                className="w-full p-2 rounded-lg border appearance-none"
                style={{
                  backgroundColor: theme.body,
                  color: priorities.find(p => p.value === watchPriority)?.color,
                  borderColor: theme.text,
                }}
              >
                {priorities.map((priority) => (
                  <option
                    key={priority.value}
                    value={priority.value}
                    style={{ color: priority.color }}
                  >
                    {priority.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Input */}
            <div className="flex-1">
              <label
                className="block mb-1 font-medium"
                style={{ color: theme.text }}
              >
                <div className="flex items-center gap-2">
                  <FiCalendar />
                  Due Date
                </div>
              </label>
              <input
                {...register("dueDate", {
                  required: "Due date is required",
                })}
                type="date"
                className="w-full p-2 rounded-lg border"
                style={{
                  backgroundColor: theme.body,
                  color: theme.text,
                  borderColor: theme.text,
                }}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onDismiss}
              className="px-4 py-2 rounded-lg border"
              style={{
                borderColor: theme.text,
                color: theme.text,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: theme.text,
                color: theme.body,
              }}
            >
              {isSubmitting ? "Saving..." : todosToEdit ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditTodoDialog;