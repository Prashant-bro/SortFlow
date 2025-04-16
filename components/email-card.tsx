"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, parseISO, isPast } from "date-fns"
import { Star, Trash, AlertTriangle, Clock, Mail, Info, Paperclip, Calendar, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Email, EmailFolder } from "@/types/email"
import { cn } from "@/lib/utils"

interface EmailCardProps {
  email: Email
  isSelected: boolean
  onSelect: (id: number) => void
  onStar: (id: number) => void
  onDelete: (id: number) => void
  onMove: (id: number, folder: EmailFolder) => void
  isLoggedIn: boolean
}

export function EmailCard({ email, isSelected, onSelect, onStar, onDelete, onMove, isLoggedIn }: EmailCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "Urgent":
        return <AlertTriangle className="h-4 w-4" />
      case "Early":
        return <Clock className="h-4 w-4" />
      case "Late":
        return <Mail className="h-4 w-4" />
      case "Neutral":
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "Urgent":
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
      case "Early":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
      case "Late":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50"
      case "Neutral":
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    }
  }

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStar(email.id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(email.id)
  }

  const handleMoveClick = (e: React.MouseEvent, folder: EmailFolder) => {
    e.stopPropagation()
    onMove(email.id, folder)
  }

  const isDeadlinePast = email.deadline ? isPast(new Date(email.deadline)) : false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700",
        "hover:shadow-md hover:scale-[1.01] transition-all",
        isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : "",
        !email.isRead && "border-l-4 border-l-blue-500 dark:border-l-blue-400",
      )}
      onClick={() => onSelect(email.id)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Email from ${email.from} with subject ${email.subject}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStarClick}
            className="text-gray-400 hover:text-yellow-400 dark:hover:text-yellow-300 focus:outline-none"
            aria-label={email.isStarred ? "Unstar email" : "Star email"}
          >
            <Star className={cn("h-5 w-5", email.isStarred && "fill-yellow-400 text-yellow-400")} />
          </button>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{email.subject}</h2>
          {email.encrypted && (
            <Lock className="h-4 w-4 text-green-600 dark:text-green-400" title="End-to-end encrypted" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getMoodColor(email.mood)} flex items-center gap-1`}>
            {getMoodIcon(email.mood)}
            {email.mood}
          </Badge>
          {(isHovering || isSelected) && (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Move email">
                    <Mail className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => handleMoveClick(e, "Inbox")}>Move to Inbox</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleMoveClick(e, "Sent")}>Move to Sent</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleMoveClick(e, "Drafts")}>Move to Drafts</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleMoveClick(e, "Social")}>Move to Social</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleMoveClick(e, "Work")}>Move to Work</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleMoveClick(e, "Spam")}>Move to Spam</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                onClick={handleDeleteClick}
                aria-label="Delete email"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">From: {email.from}</p>
      <p className="text-gray-700 dark:text-gray-300 italic mb-3">"{email.message}"</p>

      {email.attachments && email.attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {email.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs"
            >
              <Paperclip className="h-3 w-3" />
              <span>{attachment.name}</span>
              <span className="text-gray-500 dark:text-gray-400">({Math.round(attachment.size / 1024)}KB)</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <time className="text-xs text-gray-500 dark:text-gray-500" dateTime={email.timestamp}>
            {format(parseISO(email.timestamp), "MMM d, h:mm a")}
          </time>

          {email.deadline && (
            <Badge
              className={cn(
                "flex items-center gap-1 text-xs",
                isDeadlinePast
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
              )}
            >
              <Calendar className="h-3 w-3" />
              {isDeadlinePast ? "Deadline passed" : `Reply by: ${format(new Date(email.deadline), "MMM d, h:mm a")}`}
            </Badge>
          )}
        </div>

        {isLoggedIn && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(email.id)
            }}
            aria-label={`Reply to ${email.from}`}
          >
            Reply
          </Button>
        )}
      </div>
    </motion.div>
  )
}
