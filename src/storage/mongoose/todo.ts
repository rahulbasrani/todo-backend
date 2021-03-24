import { model, Schema } from "mongoose";

const todoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
<<<<<<< Updated upstream
    isActive: { type: Boolean, default: true },
=======
>>>>>>> Stashed changes
  },
  {
    collection: "todos",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
const todo = model("Todo", todoSchema);
export default todo;
