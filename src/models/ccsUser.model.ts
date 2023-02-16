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
        author: { type: String },
        comment: { type: String },
      },
    ],
    management: [
      {
        author: { type: String },
        comment: { type: String },
      },
    ],
    design: [
      {
        author: { type: String },
        comment: { type: String },
      },
    ],
    video: [
      {
        author: { type: String },
        comment: { type: String },
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
  checked: {
    tech: {
      type: Boolean,
      default: false,
    },
    management: {
      type: Boolean,
      default: false,
    },
    design: {
      type: Boolean,
      default: false,
    },
    video: {
      type: Boolean,
      default: false,
    },
  },
  isChecking: {
    tech: {
      type: Boolean,
      default: false,
    },
    management: {
      type: Boolean,
      default: false,
    },
    design: {
      type: Boolean,
      default: false,
    },
    video: {
      type: Boolean,
      default: false,
    },
  },
  checkedBy: [
    {
      type: String,
      default: "",
    },
  ],
  emailR2: {
    tech: { type: Boolean, default: false },
    management: { type: Boolean, default: false },
    design: { type: Boolean, default: false },
    video: { type: Boolean, default: false },
  },
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
    tech: { author: string; comment: string }[];
    management: { author: string; comment: string }[];
    design: { author: string; comment: string }[];
    video: { author: string; comment: string }[];
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
  checked: {
    tech: boolean;
    management: boolean;
    design: boolean;
    video: boolean;
  };
  isChecking: {
    tech: boolean;
    management: boolean;
    design: boolean;
    video: boolean;
  };
  checkedBy: string[];
  emailR2: {
    tech: boolean;
    management: boolean;
    design: boolean;
    video: boolean;
  };
}

const ccsUserModel = mongoose.model<ccsUserInterface>("CcsUser", ccsUserSchema);
export default ccsUserModel;
