"use client"
import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/toast-provider"
import { Sidebar } from "@/components/sidebar"
import { EmailCard } from "@/components/email-card"
import type { Email, EmailFolder, EmailMood, Attachment } from "@/types/email"
import { Button } from "@/components/ui/button"
import { EmailDetailSidebar } from "@/components/email-detail-sidebar"
import { SplashScreen } from "@/components/splash-screen"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ComposeModal } from "@/components/compose-modal"
import { PenSquare, Plus, Crown } from "lucide-react"
import { isPast } from "date-fns"
import { EmptyState } from "@/components/empty-state"
import { PricingModal } from "@/components/pricing-modal"
import { Badge } from "@/components/ui/badge"
import { AccountSwitcher } from "@/components/account-switcher"
import { PricingSection } from "@/components/pricing-section"
import { encryptMessage, decryptMessage } from "@/services/encryption"
import { TeamCollaboration } from "@/components/team-collaboration"
import { useAuth } from "@/contexts/auth-context"
// Sample email data with expanded properties
const sampleEmails: Email[] = [
  {
    id: 1,
    subject: "Project Update Meeting",
    from: "manager@company.com",
    message: "Let's discuss the progress on the current project and set priorities for next week.",
    mood: "Urgent",
    timestamp: "2023-11-15T09:30:00Z",
    isStarred: false,
    folder: "Inbox",
    isRead: false,
    attachments: [
      {
        id: "att-1",
        name: "project-timeline.pdf",
        size: 245000,
        type: "application/pdf",
        url: "#",
      },
    ],
    deadline: "2023-12-20T23:59:59Z",
    encrypted: true,
  },
  {
    id: 2,
    subject: "Weekly Newsletter",
    from: "newsletter@tech.com",
    message: "Check out the latest tech trends and updates from around the industry.",
    mood: "Neutral",
    timestamp: "2023-11-15T08:15:00Z",
    isStarred: true,
    folder: "Inbox",
    isRead: true,
    encrypted: false,
  },
  {
    id: 3,
    subject: "Early Bird Special Offer",
    from: "marketing@store.com",
    message: "Don't miss out on our limited-time early bird special with 30% off all items!",
    mood: "Early",
    timestamp: "2023-11-15T07:45:00Z",
    isStarred: false,
    folder: "Social",
    isRead: true,
    encrypted: true,
  },
  {
    id: 4,
    subject: "Overdue Invoice Reminder",
    from: "accounting@services.com",
    message: "This is a reminder that your invoice #12345 is now overdue. Please make payment as soon as possible.",
    mood: "Late",
    timestamp: "2023-11-14T16:20:00Z",
    isStarred: false,
    folder: "Work",
    isRead: false,
    deadline: "2023-11-30T23:59:59Z",
    encrypted: true,
  },
  {
    id: 5,
    subject: "Team Building Event",
    from: "hr@company.com",
    message: "Join us for a fun team building event next Friday at 3pm in the main conference room.",
    mood: "Neutral",
    timestamp: "2023-11-14T14:10:00Z",
    isStarred: false,
    folder: "Work",
    isRead: true,
    encrypted: false,
  },
  {
    id: 6,
    subject: "System Maintenance Notice",
    from: "it@company.com",
    message:
      "The system will be down for maintenance this Saturday from 10pm to 2am. Please save your work accordingly.",
    mood: "Early",
    timestamp: "2023-11-14T11:05:00Z",
    isStarred: false,
    folder: "Inbox",
    isRead: true,
    encrypted: true,
  },
  {
    id: 7,
    subject: "Your Order Has Shipped",
    from: "orders@ecommerce.com",
    message:
      "Your recent order #67890 has been shipped and is on its way to you. Expected delivery in 3-5 business days.",
    mood: "Neutral",
    timestamp: "2023-11-13T15:30:00Z",
    isStarred: false,
    folder: "Inbox",
    isRead: true,
    encrypted: false,
  },
  {
    id: 8,
    subject: "Feedback Request",
    from: "support@service.com",
    message: "We value your opinion! Please take a moment to complete our customer satisfaction survey.",
    mood: "Neutral",
    timestamp: "2023-11-13T10:45:00Z",
    isStarred: false,
    folder: "Spam",
    isRead: true,
    encrypted: true,
  },
  {
    id: 9,
    subject: "Draft Email",
    from: "me@myemail.com",
    to: "colleague@company.com",
    message: "Here are my thoughts on the project proposal. Let me know what you think.",
    mood: "Neutral",
    timestamp: "2023-11-12T14:20:00Z",
    isStarred: false,
    folder: "Drafts",
    isRead: true,
    encrypted: true,
  },
  {
    id: 10,
    subject: "Meeting Invitation",
    from: "calendar@company.com",
    message: "You have been invited to a meeting on Monday at 10am. Topic: Quarterly Review.",
    mood: "Early",
    timestamp: "2023-11-12T09:15:00Z",
    isStarred: true,
    folder: "Inbox",
    isRead: true,
    deadline: "2023-11-25T10:00:00Z",
    encrypted: false,
  },
]

// MoodStatistics component
function MoodStatistics({
  moodCounts,
  total,
  onMoodClick,
}: {
  moodCounts: Record<EmailMood, number>
  total: number
  onMoodClick: (mood: EmailMood) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(moodCounts).map(([mood, count]) => (
        <button
          key={mood}
          className="p-4 rounded-md shadow-sm border dark:border-gray-700 bg-white dark:bg-gray-800 text-left hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
          onClick={() => onMoodClick(mood as EmailMood)}
          aria-label={`Filter by ${mood} mood`}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{mood}</h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {count} <span className="text-gray-500 dark:text-gray-400">({((count / total) * 100).toFixed(1)}%)</span>
          </p>
        </button>
      ))}
    </div>
  )
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [emails, setEmails] = useState<Email[]>(sampleEmails)
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null)
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>("Inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const { showToast, ToastContainer } = useToast()

  const [replyText, setReplyText] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [showPricingSection, setShowPricingSection] = useState(false)

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isFolderChanging, setIsFolderChanging] = useState(false)

  // Update the sidebar state management to track if it's open or collapsed
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Auth context
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  // Calculate folder counts
  const folderCounts = emails.reduce(
    (acc, email) => {
      acc[email.folder] = (acc[email.folder] || 0) + 1
      return acc
    },
    {} as Record<EmailFolder, number>,
  )

  // Calculate mood counts
  const moodCounts = emails.reduce(
    (acc, email) => {
      acc[email.mood] = (acc[email.mood] || 0) + 1
      return acc
    },
    {} as Record<EmailMood, number>,
  )

  // Count starred emails
  const starredCount = emails.filter((email) => email.isStarred).length

  // Filter emails based on current folder, search query, and starred status
  const filteredEmails = emails.filter((email) => {
    // First check if we're in the starred view
    if (currentFolder === "Starred") {
      return email.isStarred && matchesSearch(email)
    }

    // Check if we're filtering by mood
    if (currentFolder.startsWith("Mood:")) {
      const mood = currentFolder.split(":")[1] as EmailMood
      return email.mood === mood && matchesSearch(email)
    }

    // Otherwise filter by folder
    return email.folder === currentFolder && matchesSearch(email)
  })

  // Check if an email matches the search query
  function matchesSearch(email: Email): boolean {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      email.subject.toLowerCase().includes(query) ||
      email.from.toLowerCase().includes(query) ||
      email.message.toLowerCase().includes(query)
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      showToast("Failed to log out", "error")
    }
  }

  // Update the handleReply function to simulate API call
  const handleReply = (replyText: string, attachments: Attachment[], encrypted: boolean) => {
    const targetEmail = emails.find((e) => e.id === selectedEmailId)
    if (targetEmail) {
      setIsReplying(true)

      // Always encrypt the message
      const encryptedReplyText = encryptMessage(replyText)

      // Simulate API call
      setTimeout(() => {
        // In a real app, you would send the reply to a server
        // Here we just show a toast notification
        showToast(`Reply sent to ${targetEmail.from}`, "success")

        // Add the reply to the sent folder
        const newEmail: Email = {
          id: emails.length + 1,
          subject: `Re: ${targetEmail.subject}`,
          from: user?.email || "",
          to: targetEmail.from,
          message: encryptedReplyText,
          mood: "Neutral",
          timestamp: new Date().toISOString(),
          isStarred: false,
          folder: "Sent",
          isRead: true,
          attachments: attachments.length > 0 ? attachments : undefined,
          encrypted: true, // Always encrypted
        }

        setEmails([...emails, newEmail])
        setSelectedEmailId(null)
        setIsSidebarOpen(false)
        setReplyText("")
        setAttachments([])
        setIsReplying(false)
      }, 1500)
    }
  }

  const handleSendEmail = (
    to: string,
    subject: string,
    message: string,
    attachments: Attachment[],
    deadline?: string,
    encrypted?: boolean,
    signature?: boolean,
  ) => {
    setIsSending(true)

    // Simulate API call
    setTimeout(() => {
      // Create a new email
      const newEmail: Email = {
        id: emails.length + 1,
        subject,
        from: user?.email || "",
        to,
        message,
        mood: "Neutral", // Default mood
        timestamp: new Date().toISOString(),
        isStarred: false,
        folder: "Sent",
        isRead: true,
        attachments: attachments.length > 0 ? attachments : undefined,
        deadline,
        encrypted: true, // Always encrypted
        signature,
      }

      setEmails([...emails, newEmail])
      setIsComposeOpen(false)
      setIsSending(false)
      showToast(`Email sent to ${to}`, "success")
    }, 1500)
  }

  const handleStarEmail = (id: number) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, isStarred: !email.isStarred } : email)))
  }

  const handleDeleteEmail = (id: number) => {
    // Move to trash instead of deleting
    setEmails(emails.map((email) => (email.id === id ? { ...email, folder: "Trash" } : email)))

    if (selectedEmailId === id) {
      setSelectedEmailId(null)
      setIsSidebarOpen(false)
    }

    showToast("Email moved to trash", "info")
  }

  const handleMoveEmail = (id: number, folder: EmailFolder) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, folder } : email)))

    showToast(`Email moved to ${folder}`, "success")
  }

  const handleSelectEmail = (id: number) => {
    setSelectedEmailId(id)
    setIsSidebarOpen(true)

    // Mark as read when selected
    setEmails(emails.map((email) => (email.id === id ? { ...email, isRead: true } : email)))
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setReplyText("")
    setAttachments([])
  }

  const handleAttach = (newAttachments: Attachment[]) => {
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  // Update the handleFolderChange function to pass the sidebar collapsed state
  const handleFolderChange = (folder: EmailFolder) => {
    setIsFolderChanging(true)
    setCurrentFolder(folder)

    // Simulate API call to fetch emails for the selected folder
    setTimeout(() => {
      setIsFolderChanging(false)
    }, 800)
  }

  // Add this function to handle sidebar collapse state changes
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }

  const handleUpgradeToPro = (plan: "monthly" | "yearly") => {
    // In a real app, this would handle payment processing
    // For demo purposes, we'll just show a toast
    showToast(`Upgraded to Pro (${plan}) successfully!`, "success")
    setIsPricingOpen(false)
    setShowPricingSection(false)
  }

  // Check for passed deadlines and move emails to trash
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date()
      let deadlinesPassed = false

      const updatedEmails = emails.map((email) => {
        if (email.deadline && isPast(new Date(email.deadline)) && email.folder !== "Trash" && email.folder !== "Sent") {
          deadlinesPassed = true
          return { ...email, folder: "Trash" }
        }
        return email
      })

      if (deadlinesPassed) {
        setEmails(updatedEmails)
        showToast("Some emails were moved to Trash due to missed deadlines", "info")
      }
    }

    // Check deadlines on component mount and every 30 seconds
    checkDeadlines()
    const interval = setInterval(checkDeadlines, 30000)

    return () => clearInterval(interval)
  }, [emails, showToast])

  // Mark emails as read when viewed
  useEffect(() => {
    if (selectedEmailId) {
      setEmails((prev) => prev.map((email) => (email.id === selectedEmailId ? { ...email, isRead: true } : email)))
    }
  }, [selectedEmailId])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isAuthLoading, router])

  // Decrypt messages when displayed
  useEffect(() => {
    if (selectedEmail && selectedEmail.encrypted) {
      try {
        const decryptedMessage = decryptMessage(selectedEmail.message)
        setEmails((prev) =>
          prev.map((email) =>
            email.id === selectedEmail.id
              ? { ...email, message: decryptedMessage, _originalMessage: email.message }
              : email,
          ),
        )
      } catch (error) {
        console.error("Error decrypting message:", error)
      }
    }
  }, [selectedEmailId])

  // Simulate initial data loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const selectedEmail = emails.find((e) => e.id === selectedEmailId)

  // Handle splash screen
  const handleSplashFinish = () => {
    setShowSplash(false)
  }

  // If still loading auth, show a loading spinner
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Dummy functions for handleSwitchAccount and handleAddAccount
  const handleSwitchAccount = () => {
    console.log("Switching account")
  }

  const handleAddAccount = () => {
    console.log("Adding account")
  }

  // Dummy variable for isLoggedIn
  const isLoggedIn = isAuthenticated

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>{showSplash && <SplashScreen onFinish={handleSplashFinish} />}</AnimatePresence>

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-200">
        {/* Toast Container */}
        <ToastContainer />

        {/* Navbar */}
        <nav className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-3">
                <Image src="/logo.png" alt="SortFlow Logo" fill className="object-contain" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SortFlow</h1>
            </div>

            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <Button onClick={() => router.push("/login")}>Login</Button>
              ) : (
                <div className="flex items-center gap-3">
                  {!user?.isProUser && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPricingSection(true)}
                      className="hidden md:flex items-center gap-1 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700"
                    >
                      <Crown className="h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  )}
                  {user?.isProUser && (
                    <Badge
                      variant="outline"
                      className="hidden md:flex items-center gap-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                    >
                      <Crown className="h-3 w-3" />
                      Pro
                    </Badge>
                  )}

                  {user && (
                    <AccountSwitcher
                      user={user}
                      onSwitchAccount={handleSwitchAccount}
                      onAddAccount={handleAddAccount}
                      onLogout={handleLogout}
                    />
                  )}
                </div>
              )}

              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            currentFolder={currentFolder}
            onFolderChange={handleFolderChange}
            folderCounts={folderCounts}
            moodCounts={moodCounts}
            starredCount={starredCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            className="md:block"
            isLoading={isFolderChanging}
            onCollapseChange={handleSidebarCollapseChange}
          />

          {/* Main Content Area */}
          <main
            className={cn(
              "flex-1 p-4 md:p-8 transition-all duration-300 ease-in-out",
              isSidebarCollapsed ? "md:ml-16 lg:ml-16" : "md:ml-16 lg:ml-64",
            )}
          >
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                isSidebarCollapsed ? "max-w-4xl mx-auto" : "max-w-5xl",
              )}
            >
              {/* Pricing Section (when shown) */}
              {showPricingSection && (
                <div className="mb-8">
                  <PricingSection onUpgrade={handleUpgradeToPro} isProUser={user?.isProUser || false} />
                  <div className="flex justify-center mt-6">
                    <Button variant="outline" onClick={() => setShowPricingSection(false)}>
                      Back to Inbox
                    </Button>
                  </div>
                </div>
              )}

              {/* Team Collaboration Section */}
              {!showPricingSection && user && (
                <div className="mb-8">
                  <TeamCollaboration isProUser={user.isProUser} userEmail={user.email} />
                </div>
              )}

              {!showPricingSection && (
                <>
                  {/* Folder Title and Compose Button */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentFolder === "Starred"
                          ? "Starred Emails"
                          : currentFolder.startsWith("Mood:")
                            ? `${currentFolder.split(":")[1]} Emails`
                            : currentFolder}
                      </h2>
                      {isFolderChanging && <Spinner className="ml-4" />}
                      <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                        {filteredEmails.length} {filteredEmails.length === 1 ? "email" : "emails"}
                      </p>
                    </div>

                    {isLoggedIn && (
                      <Button
                        onClick={() => setIsComposeOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <PenSquare className="h-4 w-4 mr-2" />
                        Compose
                      </Button>
                    )}
                  </div>

                  {/* Statistics Dashboard (Optional) */}
                  {currentFolder === "Inbox" && !isLoading && (
                    <div className="mb-8">
                      <MoodStatistics
                        moodCounts={moodCounts}
                        total={Object.values(moodCounts).reduce((sum, count) => sum + count, 0)}
                        onMoodClick={(mood) => handleFolderChange(`Mood:${mood}` as EmailFolder)}
                      />
                    </div>
                  )}

                  {/* Loading Indicator */}
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Spinner size="lg" />
                    </div>
                  ) : filteredEmails.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEmails.map((email) => (
                        <EmailCard
                          key={email.id}
                          email={email}
                          isSelected={selectedEmailId === email.id}
                          onSelect={handleSelectEmail}
                          onStar={handleStarEmail}
                          onDelete={handleDeleteEmail}
                          onMove={handleMoveEmail}
                          isLoggedIn={isLoggedIn}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState filter={currentFolder} />
                  )}

                  {/* Floating Compose Button (Mobile) */}
                  <div className="md:hidden fixed bottom-6 right-6 z-10">
                    <Button
                      onClick={() => setIsComposeOpen(true)}
                      className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                      aria-label="Compose new email"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </>
              )}

              {/* Email Detail Sidebar */}
              <AnimatePresence>
                {isLoggedIn && (
                  <EmailDetailSidebar
                    email={selectedEmail ? emails.find((e) => e.id === selectedEmailId) || null : null}
                    isOpen={isSidebarOpen}
                    onClose={handleCloseSidebar}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    attachments={attachments}
                    onAttach={handleAttach}
                    onRemoveAttachment={handleRemoveAttachment}
                    onReply={handleReply}
                    isReplying={isReplying}
                    isProUser={user?.isProUser || false}
                  />
                )}
              </AnimatePresence>

              {/* Compose Email Modal */}
              <ComposeModal
                isOpen={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                onSend={handleSendEmail}
                isSending={isSending}
                userEmail={user?.email || ""}
                isProUser={user?.isProUser || false}
              />

              {/* Pricing Modal */}
              <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
                onUpgrade={() => handleUpgradeToPro("monthly")}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
