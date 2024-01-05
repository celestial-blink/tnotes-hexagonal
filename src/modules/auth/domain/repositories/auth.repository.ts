export interface AuthRepository {
    updateRefreshToken(refreshToken: string): Promise<string>
}
