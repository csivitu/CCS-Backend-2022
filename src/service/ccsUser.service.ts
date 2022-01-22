import ccsUserModel from "../models/ccsUser.model";

// eslint-disable-next-line import/prefer-default-export
export async function getUser(username: string) {
  return ccsUserModel.findOne({ username });
}
