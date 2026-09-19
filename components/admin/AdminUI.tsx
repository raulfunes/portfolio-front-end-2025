"use client"

import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react"

export function AdminInput({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-[#00ff00]/70 font-mono text-xs mb-1">{label}</span>
      <input
        {...props}
        className="w-full bg-[#0d0d0d] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] font-mono text-sm focus:border-[#00ff00] focus:outline-none transition-colors"
      />
    </label>
  )
}

export function AdminTextarea({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="block text-[#00ff00]/70 font-mono text-xs mb-1">{label}</span>
      <textarea
        {...props}
        className="w-full bg-[#0d0d0d] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] font-mono text-sm focus:border-[#00ff00] focus:outline-none transition-colors min-h-[80px] resize-y"
      />
    </label>
  )
}

export function AdminButton({
  children,
  variant = "primary",
  ...props
}: {
  children: ReactNode
  variant?: "primary" | "danger" | "ghost"
} & InputHTMLAttributes<HTMLButtonElement> & { type?: "button" | "submit" }) {
  const styles = {
    primary: "bg-[#00ff00] text-[#0d0d0d] hover:bg-[#00ff00]/80",
    danger: "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30",
    ghost: "bg-transparent text-[#00ff00]/70 border border-[#00ff00]/30 hover:bg-[#00ff00]/10",
  }
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

export function AdminCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#00ff00]/30 rounded-lg p-5">
      {children}
    </div>
  )
}

export function AdminHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-mono text-[#00ff00] mb-1">{title}</h1>
        {description && <p className="text-[#00ff00]/60 font-mono text-sm">{description}</p>}
      </div>
      {action}
    </header>
  )
}

/** Parse a comma-separated string into a trimmed array */
export function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}
