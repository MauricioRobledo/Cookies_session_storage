import  express  from "express";
import * as productController from "../controllers/product.controller.js"
import * as cartController from "../controllers/cart.controller.js"
import { sessionRouter } from "./api/sessions.js";
import { viewsRouter } from "./api/viewsRouter.js";
import * as ordersController from "../controllers/orders.controller.js"


const router = express.Router()
router.get("/productos",productController.getProductController)
router.get("/productos/:id",productController.getProductByIdController)
router.get("/productos/categoria/:category", productController.getByCategoryController)
router.post("/productos",productController.saveProductController)
router.put("/productos/:id",productController.updateProductController)
router.delete("/productos/:id",productController.deleteProductController)

router.get("/carrito",cartController.getCartController)
router.get("/carrito/:id/productos",cartController.getProductOfCartController)
router.post("/carrito",cartController.createCartController)
router.post("/carrito/:id/productos",cartController.saveCartProductController)
router.delete("/carrito/:id", cartController.deleteCartController)
router.delete("/carrito/:id/productos/:idProd", cartController.deleteCartProductController)
router.post("/carrito/:id/comprar",cartController.emailOrderCartController)

router.get("/ordenes",ordersController.getOrdersController)

router.use("/",sessionRouter)
router.use("/",viewsRouter)

export {router as apiRouter}