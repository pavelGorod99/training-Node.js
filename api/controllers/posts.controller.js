const Posts = require("../data/posts");

class PostsController {

    async create(req, res) {
        const { body } = req;
        const data = await Posts.findAll();
        body.id = data.length + 1;
        body.publishedDate = new Date().valueOf();
        const response = await Posts.create(body);
        res.status(201).json(response);
    }

    async getAll(req, res) {
        const { author, isPublished } = req.params;
        const isBool = (isPublished === 'true' || isPublished === 'false');
        let data = [];

        if (author && isBool) {
            data = await Posts.findAll({
                where: {
                    [Op.and]: [{author}, {isPublished : (isPublished === 'true')}]
                }
            });
        } else {
            data = await Posts.findAll({});
        }
        res.status(200).json(data);
    }

    async getById(req, res) {

    }

    notAllowed(req, res) {

    }
}

module.exports = new PostsController();