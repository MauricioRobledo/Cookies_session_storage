import { productModel } from "./dbModels/modelProduct.js";
import { cartModel } from "./dbModels/modelCart.js";
import { UserModel } from "./dbModels/modelUser.js";
import { ordersModel } from "./dbModels/modelOrders.js";
import { MyMongoClient } from "./clients/mongoClient.js";


export async function getApiDao(){
    let UserDaoContainer;
    let ProductDaoContainer;
    let CartDaoContainer;
    let OrdersDaoContainer;
    const {UserMongoDao} = await import("./daos/user/userMongo.js");
    const {ProductMongoDao} = await import("./daos/products/productoMongo.js");
    const {CartMongoDao} = await import("./daos/cart/carritoMongo.js")
    const {OrdersMongoDao} = await import("./daos/orders/ordersMongo.js")
    //conectarnos a la base de datos mongoDB
    const client = new MyMongoClient();
    await client.connect();
    UserDaoContainer = new UserMongoDao(UserModel);
    ProductDaoContainer = new ProductMongoDao(productModel);
    CartDaoContainer = new CartMongoDao(cartModel)
    OrdersDaoContainer = new OrdersMongoDao(ordersModel)
    
    return {UserDaoContainer,ProductDaoContainer,CartDaoContainer,OrdersDaoContainer}
}