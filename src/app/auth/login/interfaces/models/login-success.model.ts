export interface LoginSuccess {
    token: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
    tokenType: string;
    notBeforePolicy: number;
    sessionState: string;
    scope: string;
}
