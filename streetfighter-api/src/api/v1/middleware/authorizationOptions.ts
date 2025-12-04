export interface AuthorizationOptions {
    hasRole: Array<"admin" | "officer" | "manager" | "user">;
    allowSameUser?: boolean;
}
