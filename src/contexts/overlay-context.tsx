"use client"

import { createContext, useContext, useState, type ReactNode, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Define the context type
type OverlayContextType = {
  isVisible: boolean
  isLoading: boolean
  showOverlay: (withLoading?: boolean) => void
  hideOverlay: () => void
  handleCancel: () => void
  // New property to safely request overlay during render
  requestOverlay: (withLoading?: boolean) => void
}

// Create the context with a default value
const OverlayContext = createContext<OverlayContextType | undefined>(undefined)

// Props for the provider component
interface OverlayProviderProps {
  children: ReactNode
  onCancel?: () => void
}

export function OverlayProvider({ children, onCancel }: OverlayProviderProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Use a ref to store overlay requests during render
  const overlayRequestRef = useRef<boolean | null>(null)

  // Handle overlay requests after render is complete
  useEffect(() => {
    if (overlayRequestRef.current !== null) {
      setIsVisible(true)
      setIsLoading(!!overlayRequestRef.current)
      overlayRequestRef.current = null
    }
  }, [])

  const showOverlay = (withLoading = false) => {
    setIsVisible(true)
    setIsLoading(withLoading)
  }

  const hideOverlay = () => {
    setIsVisible(false)
    setIsLoading(false)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    hideOverlay()
  }

  // Safe method to request overlay during render
  const requestOverlay = (withLoading = false) => {
    overlayRequestRef.current = withLoading
  }

  return (
    <OverlayContext.Provider
      value={{
        isVisible,
        isLoading,
        showOverlay,
        hideOverlay,
        handleCancel,
        requestOverlay,
      }}
    >
      {children}
      {isVisible && <UntouchableOverlay isLoading={isLoading} onCancel={handleCancel} />}
    </OverlayContext.Provider>
  )
}

// Custom hook to use the overlay context
export function useOverlay() {
  const context = useContext(OverlayContext)

  if (context === undefined) {
    throw new Error("useOverlay must be used within an OverlayProvider")
  }

  return context
}

// Apple-style loading indicator component
function AppleLoadingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-12 h-12", className)}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-0 animate-apple-spinner"
          style={{
            top: "0%",
            left: "50%",
            transform: `rotate(${i * 30}deg) translate(0, -130%)`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

// The actual overlay component
function UntouchableOverlay({
  isLoading,
  onCancel,
}: {
  isLoading: boolean
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <AppleLoadingIndicator />
          </div>
        )}
        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-black/30 text-white border-white/20 hover:bg-black/40 hover:text-white px-6 rounded-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}