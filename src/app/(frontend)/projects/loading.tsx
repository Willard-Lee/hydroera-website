export default function ProjectsLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-[#0b1120] min-h-[50vh] animate-pulse" />

      {/* Featured slider skeleton */}
      <div className="bg-[#0b1120] min-h-[55vh] animate-pulse" />

      {/* Filter bar skeleton */}
      <div className="bg-white border-b border-border py-5">
        <div className="container flex flex-wrap items-center gap-3">
          <div className="h-10 w-72 bg-muted rounded-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-28 bg-muted rounded-full" />
          ))}
          <div className="h-9 w-28 bg-muted rounded-full ml-auto" />
          <div className="h-9 w-28 bg-muted rounded-full" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/2] bg-muted rounded-t-lg" />
              <div className="h-1 w-full bg-muted" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
