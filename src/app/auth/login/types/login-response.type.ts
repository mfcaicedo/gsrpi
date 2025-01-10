import { LoginSuccess } from "../interfaces/models/login-success.model";
import { LoginError } from "../interfaces/models/login-error.model";
export type LoginResponse = LoginSuccess | LoginError;

export * from '../interfaces/models/login.model';
export * from '../interfaces/models/login-success.model';
export * from '../interfaces/models/login-error.model';