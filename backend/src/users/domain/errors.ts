export class UserAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`User ${name} already exists`);
  }
}

export class UserNotFoundError extends Error {
  constructor(name: string) {
    super(`User ${name} not found`);
  }
}
