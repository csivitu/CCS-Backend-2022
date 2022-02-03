import mongoose from "mongoose";
import {
  designSubdomains,
  designSubDomainsType,
  techSubdomains,
  techSubDomainsType,
} from "../types/subdomainTypes";

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
      domain: {
        type: String,
        enum: ["tech", "design", "management", "video"],
        unique: true,
      },
      endTime: {
        type: Date,
      },
      submitted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  techAttempted: [
    {
      quesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: {
        type: String,
      },
    },
  ],
  managementAttempted: [
    {
      quesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: {
        type: String,
      },
    },
  ],
  designAttempted: [
    {
      quesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: {
        type: String,
      },
    },
  ],
  videoAttempted: [
    {
      quesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
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
  techRound: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3],
    default: 1,
  },
  managementRound: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3],
    default: 1,
  },
  designRound: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3],
    default: 1,
  },
  videoRound: {
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
      answer: {
        type: String,
      },
    },
  ],
  comments: {
    tech: [
      {
        type: String,
      },
    ],
    management: [
      {
        type: String,
      },
    ],
    design: [
      {
        type: String,
      },
    ],
    video: [
      {
        type: String,
      },
    ],
  },
  marks: {
    tech: {
      type: Number,
      min: 0,
      max: 10,
    },
    management: {
      type: Number,
      min: 0,
      max: 10,
    },
    design: {
      type: Number,
      min: 0,
      max: 10,
    },
    video: {
      type: Number,
      min: 0,
      max: 10,
    },
  },
  description: {
    type: String,
  },
  taskAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  taskSubmitted: [
    {
      subdomain: {
        type: String,
        enum: techSubdomains.concat(designSubdomains),
      },
      task: String,
    },
  ],
  portfolio: [
    {
      category: {
        type: String,
        enum: [
          "tech",
          "design",
          "management",
          "video",
          "github",
          "linkedin",
          "instagram",
          "spotify",
        ],
      },
      link: {
        type: String,
      },
    },
  ],
});

export interface ccsUserInterface extends mongoose.Document {
  username: string;
  userId: mongoose.Schema.Types.ObjectId;
  domainsAttempted: {
    domain: "tech" | "design" | "management" | "video";
    endTime: Date;
    submitted?: boolean;
  }[];
  techAttempted: {
    quesId: mongoose.Schema.Types.ObjectId;
    answer: string;
  }[];
  managementAttempted: {
    quesId: mongoose.Schema.Types.ObjectId;
    answer: string;
  }[];
  designAttempted: {
    quesId: mongoose.Schema.Types.ObjectId;
    answer: string;
  }[];
  videoAttempted: {
    quesId: mongoose.Schema.Types.ObjectId;
    answer: string;
  }[];
  techRound: 0 | 1 | 2 | 3;
  managementRound: 0 | 1 | 2 | 3;
  designRound: 0 | 1 | 2 | 3;
  videoRound: 0 | 1 | 2 | 3;
  questionLoaded: {
    quesId: number;
    question: {
      text: string;
      img: string[];
      links: string[];
    };
    answer?: string;
  }[];
  startTime: Date;
  endTime: Date;
  comments: {
    tech: string[];
    management: string[];
    design: string[];
    video: string[];
  };
  marks: {
    tech: number;
    management: number;
    design: number;
    video: number;
  };
  description: string;
  taskAssigned: mongoose.Schema.Types.ObjectId;
  taskSubmitted: {
    subdomain: techSubDomainsType | designSubDomainsType;
    task: string;
  }[];
  portfolio: {
    category:
      | "tech"
      | "design"
      | "management"
      | "video"
      | "github"
      | "linkedin"
      | "instagram"
      | "spotify";
    link: string;
  }[];
}

const ccsUserModel = mongoose.model<ccsUserInterface>("CcsUser", ccsUserSchema);
export default ccsUserModel;
