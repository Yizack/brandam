declare module "#auth-utils" {
  interface User extends Omit<BrandamUser, "password"> {
    remember?: boolean;
    passwordless?: boolean;
  }
  interface UserSession {
    user?: User;
  }
}

export {};
