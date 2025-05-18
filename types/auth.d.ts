declare module "#auth-utils" {
  interface User extends BrandamUser {
    hash?: string;
    passwordless?: boolean;
  }
  interface UserSession {
    user?: User;
    maxAge?: number;
  }
}

export {};
