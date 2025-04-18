import type { User } from "@/types/user"

// This is a mock implementation - in a real app, you would use Firebase Auth or NextAuth.js
export async function signInWithGoogle(): Promise<User> {
  // Simulate a popup window and authentication process
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Mock successful authentication
        const user: User = {
          id: "google-user-123",
          email: "user@gmail.com",
          name: "Demo User",
          photoURL: "https://ui-avatars.com/api/?name=Demo+User&background=random",
          isProUser: false,
          accounts: [
            {
              id: "account-1",
              email: "user@gmail.com",
              isProUser: false,
              name: "Demo User",
              photoURL: "https://ui-avatars.com/api/?name=Demo+User&background=random",
            },
          ],
        }

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("isLoggedIn", "true")

        resolve(user)
      } catch (error) {
        reject(error)
      }
    }, 1500)
  })
}

export async function signInWithEmailPassword(email: string, password: string): Promise<User> {
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // In a real app, you would validate credentials with your backend
        // For demo purposes, we'll use a simple validation
        if (email === "user@example.com" && password === "password") {
          // Mock successful authentication
          const user: User = {
            id: "email-user-123",
            email: email,
            name: email.split("@")[0],
            photoURL: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
            isProUser: false,
            accounts: [
              {
                id: "account-1",
                email: email,
                isProUser: false,
                name: email.split("@")[0],
                photoURL: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
              },
            ],
          }

          // Store user in localStorage
          localStorage.setItem("user", JSON.stringify(user))
          localStorage.setItem("isLoggedIn", "true")

          resolve(user)
        } else {
          reject(new Error("Invalid credentials"))
        }
      } catch (error) {
        reject(error)
      }
    }, 1500)
  })
}

export async function signUpWithEmailPassword(email: string, password: string): Promise<User> {
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Mock successful signup
        const user: User = {
          id: "email-user-456",
          email: email,
          name: email.split("@")[0],
          photoURL: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
          isProUser: false,
          accounts: [
            {
              id: "account-1",
              email: email,
              isProUser: false,
              name: email.split("@")[0],
              photoURL: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
            },
          ],
        }

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("isLoggedIn", "true")

        resolve(user)
      } catch (error) {
        reject(error)
      }
    }, 1500)
  })
}

export async function signOut(): Promise<void> {
  return new Promise((resolve) => {
    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")

    resolve()
  })
}

export async function getCurrentUser(): Promise<User | null> {
  const userJson = localStorage.getItem("user")
  if (!userJson) return null

  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Error parsing user from localStorage", error)
    return null
  }
}

export async function isUserLoggedIn(): Promise<boolean> {
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  return isLoggedIn === "true"
}

export async function addAccount(email: string): Promise<User> {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error("No user logged in")

  // Create a new account
  const newAccount = {
    id: `account-${currentUser.accounts.length + 1}`,
    email: email,
    isProUser: false,
    name: email.split("@")[0],
    photoURL: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
  }

  // Add the account to the user
  const updatedUser: User = {
    ...currentUser,
    accounts: [...currentUser.accounts, newAccount],
  }

  // Update localStorage
  localStorage.setItem("user", JSON.stringify(updatedUser))

  return updatedUser
}

export async function switchAccount(accountId: string): Promise<User> {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error("No user logged in")

  // Find the account
  const account = currentUser.accounts.find((acc) => acc.id === accountId)
  if (!account) throw new Error("Account not found")

  // Update the current user with the selected account
  const updatedUser: User = {
    ...currentUser,
    email: account.email,
    name: account.name,
    photoURL: account.photoURL,
    isProUser: account.isProUser,
    activeAccountId: accountId,
  }

  // Update localStorage
  localStorage.setItem("user", JSON.stringify(updatedUser))

  return updatedUser
}

export async function removeAccount(accountId: string): Promise<User> {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error("No user logged in")

  // Remove the account
  const updatedAccounts = currentUser.accounts.filter((acc) => acc.id !== accountId)

  // If no accounts left, sign out
  if (updatedAccounts.length === 0) {
    await signOut()
    throw new Error("No accounts left")
  }

  // If removing the active account, switch to the first account
  let activeAccountId = currentUser.activeAccountId
  if (activeAccountId === accountId) {
    activeAccountId = updatedAccounts[0].id
  }

  // Update the user
  const updatedUser: User = {
    ...currentUser,
    accounts: updatedAccounts,
    activeAccountId,
  }

  // If the active account changed, update the user properties
  if (activeAccountId !== currentUser.activeAccountId) {
    const activeAccount = updatedAccounts.find((acc) => acc.id === activeAccountId)
    if (activeAccount) {
      updatedUser.email = activeAccount.email
      updatedUser.name = activeAccount.name
      updatedUser.photoURL = activeAccount.photoURL
      updatedUser.isProUser = activeAccount.isProUser
    }
  }

  // Update localStorage
  localStorage.setItem("user", JSON.stringify(updatedUser))

  return updatedUser
}

// Add team collaboration functions
export async function inviteTeamMember(email: string): Promise<boolean> {
  // In a real app, you would send an invitation email
  // For demo purposes, we'll just simulate a successful invitation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1500)
  })
}

export async function removeTeamMember(email: string): Promise<boolean> {
  // In a real app, you would remove the team member from your database
  // For demo purposes, we'll just simulate a successful removal
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}
