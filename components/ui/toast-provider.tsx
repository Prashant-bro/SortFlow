"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

type ToastProps = {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-500 text-green-800"
      : type === "error"
        ? "bg-red-100 border-red-500 text-red-800"
        : "bg-blue-100 border-blue-500 text-blue-800"

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-md border-l-4 ${bgColor} max-w-md`}
    >
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700" aria-label="Close notification">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  )
}

type ToastContextType = {
  showToast: (message: string, type: "success" | "error" | "info") => void
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" | "info" }>>([])

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const closeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => closeToast(toast.id)} />
      ))}
    </AnimatePresence>
  )

  return { showToast, ToastContainer }
}
