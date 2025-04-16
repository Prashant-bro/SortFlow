"use client"

import { useState } from "react"
import { X, Send, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Spinner } from "@/components/ui/spinner"
import type { Attachment } from "@/types/email"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-provider"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { encryptMessage } from "@/services/encryption"

interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (
    to: string,
    subject: string,
    message: string,
    attachments: Attachment[],
    deadline?: string,
    encrypted?: boolean,
    signature?: boolean,
  ) => void
  isSending: boolean
  userEmail: string
  isProUser: boolean
}

export function ComposeModal({ isOpen, onClose, onSend, isSending, userEmail, isProUser }: ComposeModalProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [deadline, setDeadline] = useState<string>("")
  const [useSignature, setUseSignature] = useState(true)
  const { showToast } = useToast()

  const resetForm = () => {
    setTo("")
    setSubject("")
    setMessage("")
    setAttachments([])
    setDeadline("")
    setUseSignature(true)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const handleSend = () => {
    if (to && subject && message) {
      // Check attachment size limit for free users
      if (!isProUser) {
        const totalSize = attachments.reduce((sum, attachment) => sum + attachment.size, 0)
        const maxSize = 25 * 1024 * 1024 // 25MB in bytes

        if (totalSize > maxSize) {
          showToast("Free accounts are limited to 25MB attachments. Upgrade to Pro for larger files.", "error")
          return
        }
      }

      // Always encrypt the message - encryption is now automatic
      const encryptedMessage = encryptMessage(message)

      // Pass true for encryption since we're always encrypting
      onSend(to, subject, encryptedMessage, attachments, deadline, true, useSignature)
      resetForm()
    }
  }

  const handleAttach = (newAttachments: Attachment[]) => {
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSmartCompose = () => {
    if (!isProUser) {
      showToast("AI Compose not available in Free plan. Upgrade to Pro to use this feature.", "info")
    } else {
      showToast("Smart Compose coming soon...", "info")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Message</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleClose}
            aria-label="Close compose panel"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To:
            </label>
            <Input
              id="to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              disabled={isSending}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject:
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              disabled={isSending}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message:
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSmartCompose}
                disabled={isSending}
                className="flex items-center gap-1 text-xs"
              >
                ✨ Smart Compose
              </Button>
            </div>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[200px] resize-none"
              disabled={isSending}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Set Reply Deadline (Optional):
              </label>
            </div>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              disabled={isSending}
              className="w-full"
            />
          </div>

          <FileUpload
            onAttach={handleAttach}
            attachments={attachments}
            onRemove={handleRemoveAttachment}
            disabled={isSending}
          />

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch id="signature" checked={useSignature} onCheckedChange={setUseSignature} disabled={isSending} />
              <Label htmlFor="signature" className="cursor-pointer">
                Include signature
              </Label>
            </div>
          </div>

          {!isProUser && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p>
                Free accounts are limited to 25MB attachments.{" "}
                <a href="#" className="underline font-medium">
                  Upgrade to Pro
                </a>
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" className="mr-2" onClick={handleClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!to || !subject || !message || isSending}
              className="flex items-center gap-2"
            >
              {isSending ? <Spinner size="sm" className="mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>

        {/* Footer with from address */}
        <div className="pt-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-4">
          From: {userEmail}
        </div>
      </DialogContent>
    </Dialog>
  )
}
