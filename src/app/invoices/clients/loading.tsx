import { SkeletonClientsTable } from '~/features/clients-table/components/skeleton-clients-table';
import { Card, CardContent } from '~/shared/components/card/card';
import { Skeleton } from '~/shared/components/skeletons';


export default function ClientsPageSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <SkeletonClientsTable />
    </div>
  )
}