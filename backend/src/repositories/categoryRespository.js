import prisma from "../prisma/client.js";
const CategoryRepository = {
    create:(userId, data) => {
        return prisma.category.create({
            data: {
                ...data,
                userId
            }
        });
    },
    finbyId:(id)=> prisma.category.findUnique({
        where:{id}
    }),
    findAllByUser:(userId) => prisma.category.findMany({
        where:{userId},
        orderBy:{name:"asc"}
    }),
};

export default CategoryRepository;