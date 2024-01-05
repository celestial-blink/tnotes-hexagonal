import { PrismaClient } from "@prisma/client";
import Crypt from "./core/helpers/crypt";

const prisma = new PrismaClient();

const initialize = async () => {
    try {
        const password = await Crypt.hash("@takeshi");
        await prisma.user.create({
            data: {
                name: "admin",
                email: "admin@contact.com",
                password,
                deletedAt: null,
                updatedAt: null
            }
        });


    } catch (error) {
        console.log(error);
    }
}

initialize();
