import { InternalServerError, AuthorizationError, NotFoundError } from "../utils/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let data = read("student");
    const { id } = req.params;

    if (id) {
      data = data.find((student) => student.id == id);
    }

    if (!data) return next(new NotFoundError(404, "this user not found"));

    res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const POST = (req, res, next) => {
  try {
    let students = read("student");

    req.body.id = students.length ? students.at(-1).id + 1 : 1;

    if (!req.body.balance) {
      req.body.balance = 0;
    }

    students.push(req.body);
    write("student", students);

    res.status(201).json({
      status: 201,
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { GET, POST };
