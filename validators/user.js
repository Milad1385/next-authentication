import Validator from "fastest-validator";

const v = new Validator();

const schema = {
  firstName: { type: "string", min: 4, max: 25 },
  lastName: { type: "string", min: 4, max: 25 },
  username: { type: "string", min: 4, max: 25 },
  email: { type: "string" },
  password: { type: "string", min: 8, max: 20 },
};

const check = v.compile(schema);

export default check;
