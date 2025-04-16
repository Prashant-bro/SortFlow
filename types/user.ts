export interface UserAccount {
  id: string
  email: string
  name: string
  photoURL: string
  isProUser: boolean
}

export interface User {
  id: string
  email: string
  name: string
  photoURL: string
  isProUser: boolean
  accounts: UserAccount[]
  activeAccountId?: string
}
