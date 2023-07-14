import { Router } from 'express';
import { list, countMonth } from '../Controllers/orders.js'
import { isAdmin, isAuth, requireSignIn } from '../Controllers/auth.js';

const ordersRoute = Router();

ordersRoute.get('/', requireSignIn, isAuth, list)
ordersRoute.post('/month', requireSignIn, isAuth, isAdmin, countMonth)

export default ordersRoute;