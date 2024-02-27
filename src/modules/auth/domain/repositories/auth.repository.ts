export interface AuthRepository {
    updateRefreshToken(refreshToken: string): Promise<string>,
    validatePassword(userId: string, password: string): Promise<boolean>;
}
