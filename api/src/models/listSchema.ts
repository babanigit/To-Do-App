import mongoose, { InferSchemaType, Schema } from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
    },

    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: { type: Date, required: true },

    pending: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },

    // todoState: {
    //     type: Boolean,
    //     default: false
    // },

    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
  },
  {
    timestamps: true,
  }
);

type todo = InferSchemaType<typeof todoSchema>;

const TodoModel = mongoose.model<todo>("TodoData", todoSchema);
export default TodoModel;
