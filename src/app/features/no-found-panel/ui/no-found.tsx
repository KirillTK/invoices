import { FileQuestion } from "lucide-react";
import Link from 'next/link';
import { Button } from '~/shared/components/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/shared/components/card/card';

type Props = {
  title: string;
  description: string;
  redirectButton?: {
    label: string;
    href: string;
  }
}

export const NoFoundPanel = ({ title, description, redirectButton }: Props) => {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <FileQuestion className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          {redirectButton && (
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Link href={redirectButton.href}>
                  {redirectButton.label}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
