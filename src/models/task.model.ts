import mongoose from "mongoose";
import {
  designSubdomains,
  designSubDomainsType,
  techSubdomains,
  techSubDomainsType,
} from "../types/subdomainTypes";

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
    enum: ["Tech", "Design"],
    required: true,
  },
  subDomain: {
    type: String,
    enum: techSubdomains.concat(designSubdomains),
  },
});

export interface TaskInterface extends mongoose.Document {
  taskId: number;
  question: {
    text: string;
    img: string[];
    links: string[];
  };
  domain: "Tech" | "Design";
  subDomain: techSubDomainsType | designSubDomainsType;
}

const TaskModel = mongoose.model<TaskInterface>("Task", TaskSchema);
export default TaskModel;
