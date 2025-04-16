"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Spinner } from "@/components/ui/spinner"
import type { Attachment, EmailMood } from "@/types/email"
import { Badge } from "@/components/ui/badge"
import { generateSmartReply } from "@/services/smart-reply"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ComposeEmailProps {
  isOpen: boolean
  onClose: () => void
  onSend: (
    to: string,
    subject: string,
    message: string,
    mood: EmailMood,
    attachments: Attachment[],
    deadline?: Date,
  ) => void
  isSending: boolean
  userEmail: string
}

export function ComposeEmail({ isOpen, onClose, onSend, isSending, userEmail }: ComposeEmailProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [mood, setMood] = useState<EmailMood>("Neutral")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const composeRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
      resetForm()
    }, 300)
  }

  const resetForm = () => {
    setTo("")
    setSubject("")
    setMessage("")
    setMood("Neutral")
    setAttachments([])
    setDeadline(undefined)
  }

  const handleSend = () => {
    if (to && subject && message) {
      onSend(to, subject, message, mood, attachments, deadline)
      resetForm()
    }
  }

  const handleAttach = (newAttachments: Attachment[]) => {
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSmartSuggest = async () => {
    if (!to || !subject) return

    setIsGenerating(true)
    try {
      // Create a mock email object to use with our existing smart reply service
      const mockEmail = {
        id: 0,
        subject: subject,
        from: to,
        message: "Please write me an email about this subject.",
        mood: mood,
        timestamp: new Date().toISOString(),
        folder: "Inbox",
      }

      const smartReply = await generateSmartReply(mockEmail)
      setMessage(smartReply)
    } catch (error) {
      console.error("Failed to generate smart suggestion:", error)
    } finally {
      setIsGenerating(false)
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

          {/* Compose panel */}
          <motion.div
            ref={composeRef}
            className="fixed top-0 right-0 h-full w-full md:w-[550px] bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Message</h2>
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
              </div>

              {/* Compose form */}
              <div className="p-6 flex-grow">
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
                      disabled={isSending || isGenerating}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Subject:
                    </label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject"
                      disabled={isSending || isGenerating}
                    />
                  </div>

                  <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mood:
                    </label>
                    <Select
                      value={mood}
                      onValueChange={(value) => setMood(value as EmailMood)}
                      disabled={isSending || isGenerating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="Early">Early</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message:
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSmartSuggest}
                        disabled={!to || !subject || isSending || isGenerating}
                        className="flex items-center gap-1 text-xs"
                      >
                        {isGenerating ? <Spinner size="sm" className="mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                        {isGenerating ? "Generating..." : "Smart Suggest"}
                      </Button>
                    </div>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="min-h-[200px] resize-none"
                      disabled={isSending || isGenerating}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Set Reply Deadline (Optional):
                      </label>
                      {deadline && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        >
                          <Calendar className="h-3 w-3" />
                          Reply by: {format(deadline, "PPP")}
                        </Badge>
                      )}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            deadline ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                          }`}
                          disabled={isSending || isGenerating}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {deadline ? format(deadline, "PPP") : "Select a deadline"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={deadline}
                          onSelect={setDeadline}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <FileUpload
                    onAttach={handleAttach}
                    attachments={attachments}
                    onRemove={handleRemoveAttachment}
                    disabled={isSending || isGenerating}
                  />

                  <div className="flex justify-end pt-4">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={handleClose}
                      disabled={isSending || isGenerating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSend}
                      disabled={!to || !subject || !message || isSending || isGenerating}
                      className="flex items-center gap-2"
                    >
                      {isSending ? <Spinner size="sm" className="mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                      {isSending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer with from address */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                From: {userEmail}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
