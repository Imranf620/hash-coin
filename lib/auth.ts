// lib/auth.ts
import { AuthToken, User, ApiResponse, LoginResponse } from "@/types/User"

class AuthService {
  private static instance: AuthService
  private token: string | null = null
  private user: User | null = null

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(walletAddress: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      })

      const data = await response.json()

      if (response.ok) {
        this.token = data.token
        this.user = data.user
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  async fetchUser(): Promise<ApiResponse<User>> {
    if (!this.token) {
      return { success: false, error: 'No authentication token' }
    }

    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        this.user = data
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Fetch user error:', error)
      return { success: false, error: 'Failed to fetch user' }
    }
  }

  async updateUser(updates: Partial<User>): Promise<ApiResponse<User>> {
    if (!this.token) {
      return { success: false, error: 'No authentication token' }
    }

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (response.ok) {
        this.user = data
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: 'Failed to update user' }
    }
  }

  getToken(): string | null {
    return this.token
  }

  getUser(): User | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null
  }

  logout(): void {
    this.token = null
    this.user = null
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.token) {
      throw new Error('No authentication token')
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
  }
}

export default AuthService