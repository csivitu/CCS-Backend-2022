import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import AdminModel, { AdminDocument } from "../models/admin.model";

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const admin = await AdminModel.findOne({ email });

  if (!admin) {
    return false;
  }

  const isValid = await admin.comparePassword(password);

  if (!isValid) return false;

  return omit(admin.toJSON(), "password");
}

export async function findAdmin(query: FilterQuery<AdminDocument>) {
  return AdminModel.findOne(query).lean();
}
