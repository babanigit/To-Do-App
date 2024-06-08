import mongoose, { InferSchemaType, Schema } from "mongoose";
import { title } from "process";

const todoSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true
    },

    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    todoState: {
        type: Boolean,
        default: false
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
},
{
    timestamps: true,
})

type todo = InferSchemaType<typeof todoSchema>;

const TodoModel = mongoose.model<todo>("TodoData", todoSchema)
export default TodoModel;