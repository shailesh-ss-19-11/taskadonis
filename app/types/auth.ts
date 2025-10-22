export interface LoginResponse {
  message: string
  data: {
    type: string
    token: any
    user: any
  }
}

export interface LogoutResponse {
  message: string
}

export interface MeResponse {
  data: any
}

export interface ErrorResponse {
  message: string
  code?: string
}