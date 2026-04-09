export default function CareersLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-[#0b1120] min-h-[40vh] animate-pulse" />

      {/* CMS blocks skeleton */}
      <div className="container py-12">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-7 w-48 bg-muted rounded mx-auto" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="bg-white border-b border-border py-5">
        <div className="container flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="h-10 w-full lg:w-80 bg-muted rounded-full" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-muted rounded-full" />
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="h-9 w-32 bg-muted rounded-full" />
            <div className="h-5 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* Job listings skeleton */}
      <div className="container py-16">
        <div className="animate-pulse space-y-3 mb-8">
          <div className="h-7 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse border border-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-20 bg-muted rounded-full" />
                  <div className="h-7 w-24 bg-muted rounded-full" />
                  <div className="h-7 w-20 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
