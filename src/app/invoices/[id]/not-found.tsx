import { FileQuestion } from "lucide-react";
import Link from 'next/link';
import { Button } from '~/shared/components/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/components/card/card';

export default function InvoiceNotFound() {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Invoice Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <FileQuestion className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-6">
            {/* eslint-disable-next-line react/no-unescaped-entities */ }
            We couldn't find the invoice you're looking for. It may have been deleted or the link might be incorrect.
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Link href="/invoices">
                View All Invoices
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
