"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Paperclip, X, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Attachment } from "@/types/email"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onAttach: (files: Attachment[]) => void
  attachments: Attachment[]
  onRemove: (id: string) => void
  className?: string
  disabled?: boolean
}

export function FileUpload({ onAttach, attachments, onRemove, className, disabled = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    if (disabled) return
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newAttachments: Attachment[] = []

    Array.from(fileList).forEach((file) => {
      // Create a mock URL - in a real app, you'd upload to a server
      const url = URL.createObjectURL(file)

      newAttachments.push({
        id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
      })
    })

    onAttach(newAttachments)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <Paperclip className="h-6 w-6 mb-1" />
          <p>Drag and drop files here or click to browse</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          multiple
          disabled={disabled}
        />
      </div>

      {attachments.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium">Attachments</h4>
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-md p-2 text-sm"
              >
                <File className="h-4 w-4 text-blue-500" />
                <span className="truncate max-w-[150px]">{attachment.name}</span>
                <span className="text-xs text-gray-500">({Math.round(attachment.size / 1024)}KB)</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(attachment.id)
                  }}
                  aria-label="Remove attachment"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
