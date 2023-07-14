import { Router} from 'express';
import {
    create,
    remove,
    update,
    read,
    list,
    getPhoto,
    listSearch,
    listBySearch,
    listRelated,
    listCategories,
    findProductById,
    removeAllProducts} from '../Controllers/products.js';
import {findUserById} from '../Controllers/users.js';
import {requireSignIn, isAuth, isAdmin} from '../Controllers/auth.js';
import { multerProducts } from '../Controllers/multer-config.js';

const productsRouter = Router();

productsRouter.post('/', requireSignIn, isAuth, isAdmin, multerProducts.single('image'), create); // create a new product
productsRouter.get('/:productId', read);
productsRouter.get('/', list); // list by product
productsRouter.get('/search', listSearch);
productsRouter.get('/photo/:productId', getPhoto);
productsRouter.post('/by/search', listBySearch);
productsRouter.get('/related/:productId', listRelated);
productsRouter.get('/categories', listCategories);
productsRouter.delete('/destroy/:userId', requireSignIn, isAuth, isAdmin, removeAllProducts);
productsRouter.put('/:productId', requireSignIn, isAuth, isAdmin, multerProducts.single('image'), update);
productsRouter.delete('/:productId', requireSignIn, isAuth, isAdmin, remove); // remove the product


productsRouter.param('productId', findProductById); // fine one
productsRouter.param('userId', findUserById); // finde one

export default productsRouter;