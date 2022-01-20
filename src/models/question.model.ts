import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  quesId: {
    type: Number,
    required: true,
    unique: true,
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
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  domain: {
    type: String,
    enum: ["Tech", "Design", "Management"],
    required: true,
  },
});

export interface QuestionInterface extends mongoose.Document {
  quesId: number;
  question: {
    text: string;
    img: string[];
    links: string[];
  };
  difficulty: string;
  domain: string;
}

export default QuestionSchema;
