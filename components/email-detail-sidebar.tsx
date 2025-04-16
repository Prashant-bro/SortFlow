"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO } from "date-fns"
import { X, Send, Paperclip, Sparkles, Lock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Spinner } from "@/components/ui/spinner"
import type { Email, Attachment } from "@/types/email"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast-provider"

interface EmailDetailSidebarProps {
  email: Email | null
  isOpen: boolean
  onClose: () => void
  replyText: string
  setReplyText: (text: string) => void
  attachments: Attachment[]
  onAttach: (files: Attachment[]) => void
  onRemoveAttachment: (id: string) => void
  onReply: (text: string, attachments: Attachment[], encrypted: boolean) => void
  isReplying: boolean
  isProUser: boolean
}

export function EmailDetailSidebar({
  email,
  isOpen,
  onClose,
  replyText,
  setReplyText,
  attachments,
  onAttach,
  onRemoveAttachment,
  onReply,
  isReplying,
  isProUser,
}: EmailDetailSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isClosing, setIsClosing] = useState(false)
  const { showToast } = useToast()

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen && !isClosing) {
        handleClose()
      }
    }

    // Handle escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isClosing) {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, isClosing])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  const handleReply = () => {
    if (replyText.trim() && email) {
      // Check attachment size limit for free users
      if (!isProUser) {
        const totalSize = attachments.reduce((sum, attachment) => sum + attachment.size, 0)
        const maxSize = 25 * 1024 * 1024 // 25MB in bytes

        if (totalSize > maxSize) {
          showToast("Free accounts are limited to 25MB attachments. Upgrade to Pro for larger files.", "error")
          return
        }
      }

      // Always encrypt the reply
      onReply(replyText, attachments, true)
    }
  }

  const handleSmartReply = () => {
    if (!isProUser) {
      showToast("Smart Reply not available in Free plan. Upgrade to Pro to use this feature.", "info")
    } else {
      showToast("Smart Reply coming soon...", "info")
    }
  }

  // Format the timestamp
  const formattedTime = email?.timestamp ? format(parseISO(email.timestamp), "PPpp") : ""

  // Get mood color
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "Urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Early":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Neutral":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] lg:w-[550px] bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {email && (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-8">{email.subject}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={handleClose}
                      aria-label="Close panel"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{email.from}</span>
                    <Badge className={`ml-auto ${getMoodColor(email.mood)}`}>{email.mood}</Badge>
                    {email.encrypted && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <Lock className="h-3 w-3" />
                        Encrypted
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    <time dateTime={email.timestamp}>{formattedTime}</time>
                  </div>

                  {email.deadline && (
                    <div className="mt-2">
                      <Badge className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        <Calendar className="h-3 w-3" />
                        Reply by: {format(new Date(email.deadline), "PPp")}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Email content */}
                <div className="p-6 flex-grow">
                  <div className="prose dark:prose-invert max-w-none mb-8">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{email.message}</p>
                  </div>

                  {email.attachments && email.attachments.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Attachments</h3>
                      <div className="flex flex-wrap gap-2">
                        {email.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-md p-2 text-sm"
                          >
                            <Paperclip className="h-4 w-4 text-blue-500" />
                            <span className="truncate max-w-[150px]">{attachment.name}</span>
                            <span className="text-xs text-gray-500">({Math.round(attachment.size / 1024)}KB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply section */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Reply</h3>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply here..."
                      className="min-h-[120px] resize-none mb-4"
                      aria-label="Reply message"
                      disabled={isReplying}
                    />

                    <FileUpload
                      onAttach={onAttach}
                      attachments={attachments}
                      onRemove={onRemoveAttachment}
                      className="mb-4"
                      disabled={isReplying}
                    />

                    {/* Security notice instead of toggle */}
                    <div className="flex items-center mb-4 p-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md text-xs">
                      <Lock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                      <p>Your reply will be automatically encrypted for security</p>
                    </div>

                    {!isProUser && attachments.length > 0 && (
                      <div className="flex items-center gap-2 p-2 mb-4 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-md text-sm">
                        <Badge variant="outline" className="text-xs">
                          FREE
                        </Badge>
                        <p>
                          Limited to 25MB attachments.{" "}
                          <a href="#" className="underline font-medium">
                            Upgrade to Pro
                          </a>
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSmartReply}
                        disabled={isReplying}
                        className="mr-2 bg-indigo-500 hover:bg-indigo-600 text-white"
                        aria-label="Generate smart reply"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />✨ Smart Reply
                      </Button>
                      <Button
                        onClick={handleReply}
                        disabled={!replyText.trim() || isReplying}
                        className="flex items-center gap-2"
                        aria-label="Send reply"
                      >
                        {isReplying ? <Spinner size="sm" className="mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        {isReplying ? "Sending..." : "Send"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
