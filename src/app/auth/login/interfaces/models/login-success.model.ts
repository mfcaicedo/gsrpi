export interface LoginSuccess {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Seconds
    expiresAt: number; // Timestamp
    refreshExpiresIn?: number;
    tokenType: string;
    notBeforePolicy: number;
    sessionState: string;
}
