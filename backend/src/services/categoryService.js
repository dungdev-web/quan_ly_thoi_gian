import CategoryRepository from "../repositories/categoryRespository.js";
const CategoryService = {
    createCategory:(userId, data) => {
        return CategoryRepository.create(userId, data);
    },
    getCategoryById:(id) => CategoryRepository.finbyId(id),
    getCategoriesByUser:(userId) => CategoryRepository.findAllByUser(userId),
};
export default CategoryService;