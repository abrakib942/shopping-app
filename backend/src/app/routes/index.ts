import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ItemRoutes } from '../modules/item/item.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/users',
    routes: UserRoutes,
  },
  {
    path: '/items',
    routes: ItemRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
