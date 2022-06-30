import { InternalServerError, ValidationError, NotFoundError } from "../utils/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let groups = read("group");
    let students = read("student");
    let groupStudents = read("groupStudents");

    const { id } = req.params;

    groupStudents = groupStudents.map((group) => {
      group.student = students.find((student) => student.id == group.student_id);

      return group;
    });

    groups = groups.map((group) => {
      group.students = [];

      groupStudents.forEach((student) => {
        if (student.group_id == group.id) {
          group.students.push(student.student);
        }
      });

      return group;
    });

    if (id) {
      groups = groups.find((group) => group.id == id);
    }

    if (!groups) return next(new NotFoundError(404, "this group not found"));

    res.status(200).json({
      status: 200,
      data: groups,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const POST = (req, res, next) => {
  try {
    let groups = read("group");

    req.body.id = groups.length ? groups.at(-1).id + 1 : 1;

    groups.push(req.body);
    write("group", groups);

    res.status(201).json({
      status: 201,
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETE = (req, res, next) => {
  try {
    let groups = read("group");
    let students = read("student");
    let groupStudents = read("groupStudents");

    const { id } = req.params;
    const groupIndex = groups.findIndex((group) => group.id == id);

    if (groupIndex == -1) return next(new NotFoundError(404, "this group not found"));

    groupStudents.forEach((student) => {
      if (student.group_id == id) {
        const data = students.find((user) => user.id == student.student_id);
        data.balance = data.balance + groups[groupIndex].group_price;
      }
    });

    const group = groups.splice(groupIndex, 1);

    for (let i = 0; i < groupStudents.length; i++) {
      if (groupStudents[i].group_id == id) {
        groupStudents.splice(i, 1);
        i--;
      }
    }

    write("group", groups);
    write("student", students);
    write("groupStudents", groupStudents);

    res.status(201).json({
      status: 201,
      data: group,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const ADD = (req, res, next) => {
  try {
    let groups = read("group");
    let students = read("student");
    let groupStudents = read("groupStudents");

    let student = students.find((student) => student.id == req.body.student_id);
    if (!student) return next(new NotFoundError(404, "this student not found"));

    let group = groups.find((group) => group.id == req.body.group_id);
    if (!group) return next(new NotFoundError(404, "this group not found"));

    let isInGroup = groupStudents.find(
      (group) => group.student_id == req.body.student_id && group.group_id == req.body.group_id
    );
    if (isInGroup) return next(new ValidationError(400, "this student in this group"));

    if (student.balance >= group.group_price) {
      student.balance = student.balance - group.group_price;
    } else {
      return next(new ValidationError(400, "balance"));
    }

    groupStudents.push(req.body);

    write("student", students);
    write("groupStudents", groupStudents);

    res.status(201).json({
      status: 201,
      data: {
        group,
        student,
      },
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETESTUDENT = (req, res, next) => {
  try {
    let groups = read("group");
    let students = read("student");
    let groupStudents = read("groupStudents");

    let student = students.find((student) => student.id == req.body.student_id);
    if (!student) return next(new NotFoundError(404, "this student not found"));

    let group = groups.find((group) => group.id == req.body.group_id);
    if (!group) return next(new NotFoundError(404, "this group not found"));

    let groupIndex = groupStudents.findIndex(
      (group) => group.student_id == req.body.student_id && group.group_id == req.body.group_id
    );
    if (groupIndex == -1) return next(new ValidationError(400, "this student not in this group"));
    groupStudents.splice(groupIndex, 1);

    write("groupStudents", groupStudents);

    res.status(201).json({
      status: 201,
      data: {
        group,
        student,
      },
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { GET, DELETE, POST, ADD, DELETESTUDENT };
