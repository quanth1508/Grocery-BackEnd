import verifySignUp from "../middlewares/verifySignUp.js";
import { signup, signin } from "../controllers/auth.controller.js";
import { Router } from 'express'

const loginRouter = new Router();

loginRouter.post(
  "/api/v1/auth/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ],
  signup
);

loginRouter.post("/api/v1/auth/signin", signin);

export default loginRouter;