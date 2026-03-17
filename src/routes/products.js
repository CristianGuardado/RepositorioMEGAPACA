import productsController from "../controllers/productsController";

const router = express.Router();

router.route("/")
    .get(productsController.getProducts)
    .post(productsController.insertProducts);

    router.route("/:id")
    .put(productsController.updateProducts)
    .delete(productsController.deleteProducts);

    export default router;
