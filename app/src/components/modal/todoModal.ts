export interface ITodoModel {
  // filter(arg0: (existingTodo: ITodoModel) => boolean): import("react").SetStateAction<ITodoModel[]>;
  _id: string;
  todoState?: boolean;
  completed?: boolean;

  text?: string;
  title?: string;
  priority?: "High" | "Medium" | "Low";
  dueDate?: string; // userId?:string;

  createdAt: string;
  updatedAt: string;
}
