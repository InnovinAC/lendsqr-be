import HealthRoute from '@/routes/health.route';
import { RouteInterface } from '@/lib/route/route.interface';
import { Router } from 'express';
import AuthRoute from '@/routes/auth.route';
import UserRoute from '@/routes/user.route';

type RouteConstructor = new (router: Router) => RouteInterface;

export const allRoutes: RouteConstructor[] = [AuthRoute, HealthRoute, UserRoute];
