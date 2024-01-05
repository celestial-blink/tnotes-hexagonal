import Crypt from "../../../core/helpers/crypt";
import { UserRepository } from "../domain/repositories/user.repository";
import User from "../domain/roots/user";

export default class UserApplication {
    private readonly userRepository: UserRepository;
    constructor(repository: UserRepository) {
        this.userRepository = repository;
    }

    async create(user: User) {
        const userProperties = user.properties();
        const passwordHashed = await Crypt.hash(userProperties.password);
        userProperties.password = passwordHashed;

        const userHash = User.reconstitute(userProperties);

        return await this.userRepository.save(userHash);
    }

    async update(user: User) {
        return await this.userRepository.save(user);
    }

    async getAll() {
        return this.userRepository.getAll();
    }

    async getById(id: string) {
        return this.userRepository.getById(id);
    }

    async getByEmail(email: string) {
        return this.userRepository.getByEmail(email);
    }

    async getByPage(page: number, pageSize: number) {
        return this.userRepository.getByPage(page, pageSize);
    }
}
