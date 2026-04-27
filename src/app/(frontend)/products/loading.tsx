export default function ProductsLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-[#0b1120] min-h-[40vh] animate-pulse" />

      {/* Filter bar skeleton */}
      <div className="bg-white border-b border-border py-4">
        <div className="container flex items-center gap-4">
          <div className="h-10 w-72 bg-muted rounded-full" />
          <div className="h-10 w-40 bg-muted rounded-full" />
          <div className="h-5 w-24 bg-muted rounded ml-auto" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-muted rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-24 bg-muted rounded-full" />
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
