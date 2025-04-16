"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
}

export function PricingModal({ isOpen, onClose, onUpgrade }: PricingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade to SortFlow Pro</DialogTitle>
          <DialogDescription>Unlock premium features and enhance your email experience</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Free Plan */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Basic email management</p>
            <p className="text-3xl font-bold mb-6">$0</p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Basic email sorting</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Up to 25MB attachments</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-500">AI Smart Reply</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-500">AI Smart Compose</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-500">Unlimited attachments</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-indigo-500 dark:border-indigo-400 rounded-lg p-6 relative">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
              RECOMMENDED
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Advanced features</p>
            <p className="text-3xl font-bold mb-6">
              $9.99<span className="text-sm font-normal">/month</span>
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>AI Smart Reply</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>AI Smart Compose</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Unlimited attachments</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Advanced analytics</span>
              </li>
            </ul>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={onUpgrade}>
              Upgrade Now
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
