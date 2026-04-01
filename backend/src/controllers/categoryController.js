import CategoryService from "../services/categoryService.js";
const CategoryController = {
    createCategory: async (req, res) => {
        try {
            const userId = req.userId;
            const { name } = req.body;
            const data = { name };
            const category = await CategoryService.createCategory(userId, data);
            res.status(201).json(category);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const category = await CategoryService.getCategoryById(id);
            res.json(category);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getCategoriesByUser: async (req, res) => {
        try {
            const userId = req.userId;
            const categories = await CategoryService.getCategoriesByUser(userId);
            res.json(categories);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
export default CategoryController;