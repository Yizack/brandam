declare module "#auth-utils" {
  interface User {
    hash?: string;
    passwordless?: boolean;
  }
  interface UserSession {
    user?: User;
    maxAge?: number;
  }
}

export {};
