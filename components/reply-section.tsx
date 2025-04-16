"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import type { Email, Attachment } from "@/types/email"

interface ReplySectionProps {
  email: Email
  onReply: (text: string, attachments: Attachment[]) => void
}

export function ReplySection({ email, onReply }: ReplySectionProps) {
  const [replyText, setReplyText] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText, attachments)
      setReplyText("")
      setAttachments([])
    }
  }

  const handleAttach = (newAttachments: Attachment[]) => {
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
    >
      <div className="mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white">Replying to: {email.from}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Subject: {email.subject}</p>
      </div>
      <div className="space-y-4">
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply here..."
          className="min-h-[120px] resize-none"
          aria-label="Reply message"
        />

        <FileUpload onAttach={handleAttach} attachments={attachments} onRemove={handleRemoveAttachment} />

        <div className="flex justify-end">
          <Button
            onClick={handleReply}
            disabled={!replyText.trim()}
            className="flex items-center gap-2"
            aria-label="Send reply"
          >
            <Send className="h-4 w-4" /> Send
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
