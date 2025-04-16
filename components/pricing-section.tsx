"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface PricingSectionProps {
  onUpgrade: (plan: "monthly" | "yearly") => void
  isProUser: boolean
}

export function PricingSection({ onUpgrade, isProUser }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  const features = [
    "AI Smart Reply",
    "AI Smart Compose",
    "Unlimited attachments",
    "Priority support",
    "Advanced analytics",
    "Multiple accounts",
    "Custom filters",
    "Email scheduling",
  ]

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Choose Your Plan</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Upgrade to SortFlow Pro and unlock premium features
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center">
            <span
              className={`mr-4 text-sm ${billingCycle === "monthly" ? "font-medium text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
            >
              Monthly
            </span>
            <div className="flex items-center">
              <Switch
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                id="billing-toggle"
              />
              <Label htmlFor="billing-toggle" className="sr-only">
                Toggle billing cycle
              </Label>
            </div>
            <span
              className={`ml-4 text-sm ${billingCycle === "yearly" ? "font-medium text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
            >
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Save ₹700
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Basic email management</p>
              <p className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white">₹0</p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Forever free</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
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
                <li className="flex items-start opacity-50">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="line-through">AI Smart Reply</span>
                </li>
                <li className="flex items-start opacity-50">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="line-through">AI Smart Compose</span>
                </li>
                <li className="flex items-start opacity-50">
                  <Check className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="line-through">Unlimited attachments</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button variant="outline" className="w-full" disabled={true}>
                  Current Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-indigo-500 dark:border-indigo-400 relative"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pro</h3>
                <Crown className="ml-2 h-5 w-5 text-yellow-500" />
              </div>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {billingCycle === "monthly" ? "Perfect for testing the power of SortFlow" : "Best Value – Save ₹700!"}
              </p>
              <p className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white">
                {billingCycle === "monthly" ? "₹250" : "₹2,300"}
              </p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {billingCycle === "monthly" ? "per month" : "per year"}
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Everything in Free</span>
                </li>
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => onUpgrade(billingCycle)}
                  disabled={isProUser}
                >
                  {isProUser ? "Current Plan" : `Choose ${billingCycle === "monthly" ? "Monthly" : "Yearly"}`}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
