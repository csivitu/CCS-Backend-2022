import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  taskId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  question: {
    text: {
      type: String,
      required: true,
    },
    img: [
      {
        type: String,
      },
    ],
    links: [
      {
        type: String,
      },
    ],
  },
  domain: {
    type: String,
    enum: ["Tech", "Design", "Management", "Video"],
    required: true,
  },
  subDomain: {
    type: String,
  },
});

export interface TaskInterface extends mongoose.Document {
  taskId: number;
  question: {
    text: string;
    img: string[];
    links: string[];
  };
  difficulty: "Easy" | "Medium" | "Hard";
  domain: "Tech" | "Design" | "Management";
}

const TaskModel = mongoose.model<TaskInterface>("Task", TaskSchema);
export default TaskModel;
