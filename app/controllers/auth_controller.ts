// app/controllers/auth_controller.ts
import AuthService from '#services/auth_service'
import AuthException from '#exceptions/AuthException'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * User signup
   */
  public static async signup({ request, response }: HttpContext) {
    try {
      const { email, password, name } = request.only(['email', 'password', 'name'])
      
      const user = await AuthService.signup(email, password, name)
      return response.created({ 
        message: 'Signup successful', 
        data: user 
      })
    } catch (error) {
      if (error instanceof AuthException) {
        return response.status(error.status).send({
          message: error.message,
          code: 'AUTH_ERROR'
        })
      }
      throw error
    }
  }

  /**
   * User login
   */
  public static async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      
      const result = await AuthService.login(email, password)
      return response.ok({
        message: 'Login successful',
        ...result
      })
    } catch (error) {
      if (error instanceof AuthException) {
        return response.status(error.status).send({
          message: error.message,
          code: 'AUTH_ERROR'
        })
      }
      throw error
    }
  }

  /**
   * User logout
   */
  public static async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await AuthService.logout(user, auth.user?.currentAccessToken)
      return response.ok({ message: 'Logout successful' })
    } catch (error) {
      return response.internalServerError({ 
        message: 'Logout failed' 
      })
    }
  }

  /**
   * Get current user
   */
  public static async getCurrentUser({ auth, response }: HttpContext) {
    console.log(auth)
    try {
      const user = auth.user!
      const userData = await AuthService.getCurrentUser(user)
      return response.ok({ data: userData })
    } catch (error) {
      throw AuthException.unauthenticated()
    }
  }
}