import questionModel from "../models/question.model";

export default async function getQuestion(domain: string, difficulty: string) {
  return questionModel.find({ domain, difficulty }).select("quesId question");
}
export async function getAllQuestion() {
  return questionModel.find({}).select("_id quesId question");
}

// export async function final(easyquestions, mediumquestions, hardquestions) {
//   const easyshuffled = easyquestions.sort(() => 0.5 - Math.random());
//   let selected = easyshuffled.slice(0, 2);

//   const mediumshuffled = mediumquestions.sort(() => 0.5 - Math.random());
//   const mediumselected = mediumshuffled.slice(0, 2);

//   const hardshuffled = hardquestions.sort(() => 0.5 - Math.random());
//   const hardselected = hardshuffled.slice(0, 2);

//   selected = selected.concat(hardselected);
//   selected = selected.concat(mediumselected);

//   const fin = [];
//   // eslint-disable-next-line no-plusplus
//   for (let i = 0; i < selected.length; i++) {
//     const obj = {};
//     obj.quesId = selected[i].quesId;
//     obj.question = selected[i].question;
//     fin.push(obj);
//   }
//   return fin;
// }
