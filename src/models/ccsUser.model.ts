import mongoose from "mongoose";

const ccsUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  domainsAttempted: [
    {
      type: String,
      enum: ["Tech", "Design", "Management"],
    },
  ],
  techAttempted: [
    {
      quesId: {
        type: Number,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  managementAttempted: [
    {
      quesId: {
        type: Number,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  designAttempted: [
    {
      quesId: {
        type: Number,
        required: true,
      },
      answer: {
        type: String,
      },
    },
  ],
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  round: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3],
    default: 1,
  },
  questionLoaded: [
    {
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
    },
  ],
});

export interface ccsUserInterface extends mongoose.Document {
  username: string;
  userId: mongoose.Schema.Types.ObjectId;
  domainsAttempted: ("Tech" | "Design" | "Management")[];
  techAttempted: {
    quesId: number;
    answer: string;
  }[];
  designAttempted: {
    quesId: number;
    answer: string;
  }[];
  managementAttempted: {
    quesId: number;
    answer: string;
  }[];
  round: 0 | 1 | 2 | 3;
  questionLoaded: {
    quesId: number;
    question: {
      text: string;
      img: string[];
      links: string[];
    };
  }[];
  startTime: Date;
  endTime: Date;
}

const ccsUserModel = mongoose.model<ccsUserInterface>("CcsUser", ccsUserSchema);
export default ccsUserModel;
