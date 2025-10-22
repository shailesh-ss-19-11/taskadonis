// app/services/auth_service.ts
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import AuthException from '#exceptions/AuthException'

export default class AuthService {
    public static async signup(
        email: string,
        password: string,
        name: string
    ): Promise<any> {
        // Check if user already exists
        const existingUser = await User.findBy('email', email)
        if (existingUser) {
            throw AuthException.userAlreadyExists() // Use the new exception
        }

        // Create user - let AdonisJS handle the password hashing automatically
        const user = await User.create({
            email,
            password: password, // Let the model's @beforeSave hook handle hashing
            fullName: name,
        })

        // Return user without password
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            createdAt: user.createdAt
        }
    }

    public static async login(
        email: string,
        password: string
    ): Promise<{ type: string; token: string; user: any }> {
        const user = await User.findBy('email', email)
        if (!user) {
            throw AuthException.invalidCredentials()
        }

        // Debug logging
        console.log('Login attempt for user:', email)
        console.log('Stored hash exists:', !!user.password)

        // Verify password - CORRECT ORDER: hash.verify(hashedPassword, plainPassword)
        const isValid = await hash.verify(user.password, password)
        console.log('Password validation result:', isValid)

        if (!isValid) {
            throw AuthException.invalidCredentials()
        }

        // Create token
        const token = await User.accessTokens.create(user)
        
        return {
            type: 'bearer',
            token: token.value!.release(), // Correct way to get token string
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            },
        }
    }

    public static async logout(user: User, token?: any): Promise<void> {
        if (token) {
            await User.accessTokens.delete(user, token.identifier)
        }
    }

    public static async getCurrentUser(user: User): Promise<any> {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName
        }
    }
}