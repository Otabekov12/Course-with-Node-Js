import { Router } from "express";
import controller from "../controller/group.js";
import valdation from "../middlewares/validation.js";

const router = Router();

router.get("/groups", controller.GET);
router.get("/groups/:id", controller.GET);

router.post("/groups", valdation, controller.POST);
router.post("/addToGroup", valdation, controller.ADD);
router.post("/deleteFromGroup", controller.DELETESTUDENT);

router.delete("/groups/:id", controller.DELETE);

export default router;
