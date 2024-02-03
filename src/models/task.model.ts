import mongoose from "mongoose";
import {
  designSubdomains,
  designSubDomainsType,
  techSubdomains,
  techSubDomainsType,
  videoSubdomains,
  videoSubDomainsType,
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
    enum: ["tech", "design"],
    required: true,
  },
  subDomain: {
    type: String,
    enum: techSubdomains.concat(designSubdomains, videoSubdomains),
  },
});

export interface TaskInterface extends mongoose.Document {
  taskId: number;
  question: {
    text: string;
    img: string[];
    links: string[];
  };
  domain: "tech" | "design";
  subDomain: techSubDomainsType | designSubDomainsType | videoSubDomainsType;
}

const TaskModel = mongoose.model<TaskInterface>("Task", TaskSchema);
export default TaskModel;
