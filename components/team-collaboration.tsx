"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast-provider"
import { Spinner } from "@/components/ui/spinner"
import { Users, UserPlus, Crown, X, Mail } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  status: "active" | "pending"
  joinedAt?: string
}

interface TeamCollaborationProps {
  isProUser: boolean
  userEmail: string
}

export function TeamCollaboration({ isProUser, userEmail }: TeamCollaborationProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const { showToast } = useToast()

  const handleInvite = async () => {
    if (!inviteEmail) {
      showToast("Please enter an email address", "error")
      return
    }

    if (!isValidEmail(inviteEmail)) {
      showToast("Please enter a valid email address", "error")
      return
    }

    if (inviteEmail === userEmail) {
      showToast("You cannot invite yourself", "error")
      return
    }

    if (teamMembers.some((member) => member.email === inviteEmail)) {
      showToast("This user is already a team member", "error")
      return
    }

    // Check if free user has reached the limit
    if (!isProUser && teamMembers.length >= 2) {
      showToast("Free plan is limited to 2 team members. Upgrade to Pro for unlimited team members.", "error")
      return
    }

    setIsInviting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newMember: TeamMember = {
        id: `member-${Date.now()}`,
        email: inviteEmail,
        status: "pending",
      }

      setTeamMembers([...teamMembers, newMember])
      setInviteEmail("")
      showToast(`Invitation sent to ${inviteEmail}`, "success")
    } catch (error) {
      showToast("Failed to send invitation. Please try again.", "error")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const member = teamMembers.find((m) => m.id === id)
      setTeamMembers(teamMembers.filter((member) => member.id !== id))

      if (member) {
        showToast(`${member.email} removed from team`, "info")
      }
    } catch (error) {
      showToast("Failed to remove team member. Please try again.", "error")
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5" /> Team Collaboration
            </CardTitle>
            <CardDescription>Invite team members to collaborate on your inbox</CardDescription>
          </div>
          {!isProUser && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 flex items-center gap-1"
            >
              <span>Free Plan: 2 members max</span>
            </Badge>
          )}
          {isProUser && (
            <Badge
              variant="outline"
              className="bg-indigo-50 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 flex items-center gap-1"
            >
              <Crown className="h-3 w-3 mr-1" /> Unlimited Team Members
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
              disabled={isInviting || (!isProUser && teamMembers.length >= 2)}
            />
            <Button
              onClick={handleInvite}
              disabled={isInviting || (!isProUser && teamMembers.length >= 2)}
              className="flex items-center gap-2"
            >
              {isInviting ? (
                <>
                  <Spinner size="sm" />
                  <span>Inviting...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Invite</span>
                </>
              )}
            </Button>
          </div>

          {!isProUser && teamMembers.length >= 2 && (
            <div className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-2">
              <Crown className="h-4 w-4" />
              <span>
                You've reached the free plan limit.{" "}
                <a href="#" className="underline font-medium">
                  Upgrade to Pro
                </a>{" "}
                for unlimited team members.
              </span>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Team Members ({teamMembers.length})</h3>
            {teamMembers.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                <p>No team members yet</p>
                <p className="text-sm mt-1">Invite colleagues to collaborate on your inbox</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 dark:text-blue-300">{userEmail}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Account Owner</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">You</Badge>
                </div>

                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">{member.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.status === "pending" ? "Invitation Pending" : "Active Member"}
                      </p>
                    </div>
                    <Badge
                      className={
                        member.status === "pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }
                    >
                      {member.status === "pending" ? "Pending" : "Active"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleRemoveMember(member.id)}
                      aria-label={`Remove ${member.email}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">All team members have full access to this inbox</p>
        {!isProUser && (
          <Button
            variant="outline"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
