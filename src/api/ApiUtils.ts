import { HttpStatusCode } from "axios";

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  constructor(private readonly value: T) { }

  isOk(): this is Ok<T, E> {
    return true
  }

  unwrap(): T {
    return this.value;
  }
}

export class Err<T, E> {
  constructor(private readonly value: E) { }

  isOk(): this is Ok<T, E> {
    return false;
  }

  unwrapErr(): E {
    return this.value;
  }
}

export class ClientErr {
  constructor(private readonly statusCode: HttpStatusCode, private readonly errBody: Record<string, string>) { }

  get status() {
    return this.statusCode
  }

  get error() {
    return this.errBody
  }
}
