const ProductModel = require("../data/products.model");

class ProductController {

    async createProduct(req, res) {
        try {
            const { body } = req;
            const data = await ProductModel.findAll({});
            body.id = data.length + 1;
            body.isPublished = false;
            const response = await ProductModel.create(body);
            res.status(201).json(response);
        } catch (err) {
            throw new Error(err);
        }
    }

    async getProduct(req, res) {
        const data = ProductModel.findAll({});
        res.status(200).json(data);
    }

    async getProductById(req, res) {
        const productId = req.params.id;
        const data = ProductModel.findOne({
            where: { id: productId }
        });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(400).send("Product not found!");
        }
    }

    async partiallyUpdateProduct(req, res) {
        const { id } = req.params;
        const { body } = req;

        try {
            const product = await ProductModel.findOne({
                where: { id: id }
            });
            if (product) {
                const criteria1 = product.mrp >= product.price;
                const criteria2 = product.stock > 0;

                if (!criteria1 && !criteria2) {
                    res.status(422).send(['MRP should be less than equal to the Price', 'Stock count is 0']);
                } else if (!criteria1) {
                    res.status(422).send(['MRP should be less than equal to the Price']);
                } else if (!criteria2) {
                    res.status(422).send(['Stock count is 0']);
                } else if (criteria1 && criteria2) {
                    await product.update({ isPublished: body.isPublished });
                    res.status(204).json({});
                }
            } else {
                res.status(404).send("Product not found!");
            }
        } catch (error) {
            console.error("Error updating product: ", error);
            res.status(500).send("Internal Server Error");
        }
    }

    deleteOrUpdateById(req, res) {
        res.status(405).json({ message: "Not allowed!" });
    }
}

module.exports = new ProductController();