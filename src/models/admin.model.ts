import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface AdminInput {
  email: string;
  name: string;
  password: string;
}

export interface AdminDocument extends AdminInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
adminSchema.pre("save", async function (next) {
  const admin = this as AdminDocument;

  if (!admin.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(admin.password, salt);

  admin.password = hash;

  return next();
});

// eslint-disable-next-line func-names
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const admin = this as AdminDocument;

  return bcrypt.compare(candidatePassword, admin.password).catch(() => false);
};

const AdminModel = mongoose.model<AdminDocument>("User", adminSchema);

export default AdminModel;
