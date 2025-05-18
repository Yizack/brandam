declare module "#auth-utils" {
  interface User extends BamfolioUser {
    hash?: string;
    passwordless?: boolean;
  }
  interface UserSession {
    user?: User;
    maxAge?: number;
  }
}

export {};
