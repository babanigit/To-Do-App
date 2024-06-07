export interface ITodoModel{
    // filter(arg0: (existingTodo: ITodoModel) => boolean): import("react").SetStateAction<ITodoModel[]>;
    _id:string;
    todoState?:boolean;
    title:string;
    text:string;
    createdAt:string;
    updatedAt:string;
}