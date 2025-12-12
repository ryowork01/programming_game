import type React from "react"

interface RPGWindowProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function RPGWindow({ title, children, className = "" }: RPGWindowProps) {
  return (
    <div className={`dq-window ${className}`}>
      {title && <div className="dq-title">{title}</div>}
      <div className="dq-content">{children}</div>
    </div>
  )
}

interface RPGButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function RPGButton({ children, className = "", ...props }: RPGButtonProps) {
  return (
    <button className={`dq-button ${className}`} {...props}>
      {children}
    </button>
  )
}

export function RPGBar({
  label,
  current,
  max,
  color = "cyan",
}: {
  label: string
  current: number
  max: number
  color?: "cyan" | "pink" | "gold"
}) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  const colorClass = {
    cyan: "bg-cyan-400",
    pink: "bg-pink-400",
    gold: "bg-yellow-400",
  }[color]

  return (
    <div className="dq-bar-wrapper">
      <div className="dq-label">
        {label}: {current}/{max}
      </div>

      <div className="dq-bar">
        <div className={`dq-bar-fill ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
