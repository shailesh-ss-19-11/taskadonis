// app/exceptions/AuthException.ts

import { Exception } from '@adonisjs/core/exceptions'

export default class AuthException extends Exception {
  static status = 401

  static invalidCredentials() {
    return new this('Invalid credentials', { status: 401 })
  }

  static unauthenticated() {
    return new this('Unauthenticated', { status: 401 })
  }

  static userAlreadyExists() {
    return new this('User already exists', { status: 409 })
  }
}