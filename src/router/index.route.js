import AuthRouter from "./auth.route.js";
import UserRouter from "./user.route.js";
import EventRouter from "./event.route.js";

export default (app) => {
    const authRouter = new AuthRouter();
    const userRouter = new UserRouter();
    const eventRouter = new EventRouter();
    // app.use("/api/v1/users", userRouter.getRoute());
    app.use("/api/v1/auth", authRouter.getRoute());
    // app.use("/api/v1/event", eventRouter.getRoute());
};