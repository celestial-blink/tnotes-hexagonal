import { PrismaClient } from "@prisma/client";
import { Result, err, ok } from "neverthrow";
import { UserRepository } from "../domain/repositories/user.repository";
import User from "../domain/roots/user";
import UserModelDto, { FromDataToResponse } from "./dtos/user.model.dto";
import DataBaseException from "../../../core/exceptions/database.exception";

export type UserResult = Result<
    FromDataToResponse | FromDataToResponse[],
    DataBaseException
>;
export type UserDomainResult = Result<User, DataBaseException>;
export type UserGetByPage = Result<
    [entities: FromDataToResponse[], total: number],
    DataBaseException
>;

export default class UserInfrastructure implements UserRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async save(user: User): Promise<UserResult> {
        try {
            const userEntity = UserModelDto.fromDomainToData(user);
            const { email } = user.properties();
            const result = await this.prisma.user.upsert({
                create: {
                    ...userEntity,
                },
                update: {
                    ...userEntity,
                },
                where: { email },
            });

            return ok(UserModelDto.fromDataToResponse(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getAll(): Promise<UserResult> {
        try {
            const result = await this.prisma.user.findMany();
            return ok(UserModelDto.fromDataToResponse(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getById(id: string): Promise<UserDomainResult> {
        try {
            const result = await this.prisma.user.findFirst({
                where: { id },
            });
            return ok(UserModelDto.fromDataToDomain(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getByEmail(email: string): Promise<UserDomainResult> {
        try {
            const result = await this.prisma.user.findFirst({
                where: { email },
            });
            return ok(UserModelDto.fromDataToDomain(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getByPage(page: number, pageSize: number): Promise<UserGetByPage> {
        try {
            const total = await this.prisma.user.count({
                where: { deletedAt: null },
            });
            const users = await this.prisma.user.findMany({
                where: { deletedAt: null },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = UserModelDto.fromDataToResponse(
                users
            ) as FromDataToResponse[];
            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
}

