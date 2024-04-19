import Validator from "fastest-validator";

const v = new Validator();

const schema = {
  title: { type: "string", min: 4, max: 35 },
  isCompleted: { type: "boolean" },
};

const check = v.compile(schema);

export default check;
