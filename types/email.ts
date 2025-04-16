export type EmailMood = "Urgent" | "Early" | "Late" | "Neutral"
export type EmailFolder = "Inbox" | "Sent" | "Drafts" | "Trash" | "Spam" | "Social" | "Work" | "Starred"

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface Email {
  id: number
  subject: string
  from: string
  to?: string
  message: string
  mood: EmailMood
  timestamp: string
  isStarred?: boolean
  folder: EmailFolder
  attachments?: Attachment[]
  isRead?: boolean
  deadline?: string // ISO date string for the deadline
  encrypted?: boolean // Whether the email is encrypted
  signature?: boolean // Whether the email includes a signature
}
