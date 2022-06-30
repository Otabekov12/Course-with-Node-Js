import { studentScheme, groupScheme } from "../utils/validations.js";
import { ValidationError } from "../utils/error.js";

export default (req, res, next) => {
  try {
    if (req.url == "/students" && req.method == "POST") {
      let { error } = studentScheme.validate(req.body);
      if (error) throw error;
    }

    if (req.url == "/groups" && req.method == "POST") {
      let { error } = groupScheme.validate(req.body);
      if (error) throw error;
    }

    return next();
  } catch (error) {
    return next(new ValidationError(401, error.message));
  }
};
