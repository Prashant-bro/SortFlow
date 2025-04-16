"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, LogOut, PlusCircle, Crown, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/user"
import { useToast } from "@/components/ui/toast-provider"
import { Spinner } from "@/components/ui/spinner"

interface AccountSwitcherProps {
  user: User
  onSwitchAccount: (accountId: string) => Promise<void>
  onAddAccount: () => void
  onLogout: (accountId?: string) => Promise<void>
}

export function AccountSwitcher({ user, onSwitchAccount, onAddAccount, onLogout }: AccountSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { showToast } = useToast()

  const handleSwitchAccount = async (accountId: string) => {
    if (accountId === user.activeAccountId) {
      setIsOpen(false)
      return
    }

    setIsLoading(accountId)
    try {
      await onSwitchAccount(accountId)
      showToast("Account switched successfully", "success")
    } catch (error) {
      showToast("Failed to switch account", "error")
    } finally {
      setIsLoading(null)
      setIsOpen(false)
    }
  }

  const handleLogout = async (accountId?: string) => {
    setIsLoading(accountId || "all")
    try {
      await onLogout(accountId)
      showToast(accountId ? "Logged out from account" : "Logged out from all accounts", "info")
    } catch (error) {
      showToast("Failed to log out", "error")
    } finally {
      setIsLoading(null)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="bg-indigo-500 text-white">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hidden md:block">{user.email}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Accounts</h3>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {user.accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                      account.id === user.activeAccountId ? "bg-gray-50 dark:bg-gray-750" : ""
                    }`}
                    onClick={() => handleSwitchAccount(account.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={account.photoURL || "/placeholder.svg"} alt={account.name} />
                      <AvatarFallback className="bg-indigo-500 text-white">
                        {account.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{account.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{account.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.isProUser && (
                        <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          <span className="text-xs">Pro</span>
                        </Badge>
                      )}
                      {account.id === user.activeAccountId && <Check className="h-4 w-4 text-green-500" />}
                      {isLoading === account.id && <Spinner size="sm" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={onAddAccount}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add another account
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => handleLogout()}
                  disabled={isLoading === "all"}
                >
                  {isLoading === "all" ? <Spinner size="sm" className="mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
                  Sign out of all accounts
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
