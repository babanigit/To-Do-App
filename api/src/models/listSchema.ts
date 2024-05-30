import mongoose, { InferSchemaType, Schema } from "mongoose";

const todoSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true
    },

    text: {
        type: String,
        required: true
    },
    todoState: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

type todo = InferSchemaType<typeof todoSchema>;

const TodoModel = mongoose.model<todo>("TodoData", todoSchema)
export default TodoModel;