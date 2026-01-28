import { Router } from "express";
import { AuthRoutes } from "../modules/auth";
import { UserRoutes } from "../modules/user";
import { ProjectRoutes } from "../modules/project";
import { RequestRoutes } from "../modules/request";
import { TaskRoutes } from "../modules/task";
import { SubmissionRoutes } from "../modules/submission";
import { MessageRoutes } from "../modules/message/message.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/projects",
    route: ProjectRoutes,
  },
  {
    path: "/requests",
    route: RequestRoutes,
  },
  {
    path: "/tasks",
    route: TaskRoutes,
  },
  {
    path: "/submissions",
    route: SubmissionRoutes,
  },
  {
    path: "/messages",
    route: MessageRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});