interface LogoProps {
  className?: string
}

export function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h5mRVFtEPbh5FwBvR7t9Q1UF1AbSJd.png"
        alt="Shastri Logo"
        className="w-full h-full object-contain"
      />
    </div>
  )
}

