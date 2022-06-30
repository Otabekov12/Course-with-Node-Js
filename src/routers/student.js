import { Router } from "express";
import controller from "../controller/student.js";
import validation from "../middlewares/validation.js";

const router = Router();

router.get("/students", controller.GET);
router.get("/students/:id", controller.GET);

router.post("/students", validation, controller.POST);

export default router;
