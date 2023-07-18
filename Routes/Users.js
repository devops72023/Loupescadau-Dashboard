import { Router } from "express"
import { requireSignIn, isAuth, isAdmin } from './../Controllers/auth.js'
import { qeuryAllUsers, findUserById, read, update, create, deleteUser, updateCurrentUser, updatePassword, deleteMultiple } from "../Controllers/users.js";
import { multerUsers } from "../Controllers/multer-config.js";

const usersRoute = Router();

usersRoute.param('userId', findUserById);
usersRoute.get('/', requireSignIn, isAuth, isAdmin, qeuryAllUsers);
usersRoute.post('/', requireSignIn, isAuth, isAdmin, multerUsers.single('image'), create);
usersRoute.get('/:userId', requireSignIn, isAuth, read);
usersRoute.put('/:userId', requireSignIn, isAuth, isAdmin, multerUsers.single('image'), update);
usersRoute.put('/current-user/change-password/:userId', requireSignIn, isAuth, isAdmin, updatePassword);
usersRoute.put('/current-user/:userId', requireSignIn, isAuth, isAdmin, multerUsers.single('image'), updateCurrentUser);
usersRoute.delete('/:userId', requireSignIn, isAuth, isAdmin, deleteUser);
usersRoute.delete('/:userId/multiple', requireSignIn, isAuth, isAdmin, deleteMultiple);

export default usersRoute