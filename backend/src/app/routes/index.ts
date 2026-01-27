import { Router } from "express";
import { AuthRoutes } from "../modules/auth";
import { UserRoutes } from "../modules/user";
import { ProjectRoutes } from "../modules/project";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});