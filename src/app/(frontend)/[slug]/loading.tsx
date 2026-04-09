export default function PageLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-[#0b1120] min-h-[50vh]" />

      {/* Content blocks skeleton */}
      <div className="container py-16 space-y-16">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
