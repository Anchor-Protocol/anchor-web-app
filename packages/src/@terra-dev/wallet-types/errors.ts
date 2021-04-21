export class UserDeniedError extends Error {
  constructor() {
    super('User Dinied');
  }

  toString = () => {
    return `[UserDeniedError]`;
  };
}
