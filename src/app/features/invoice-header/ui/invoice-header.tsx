'use client';
import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { cn } from '~/shared/utils/utils';
import { CreditCard, FileText, PieChart, Settings, Users } from 'lucide-react';

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const INDEX_PAGE = "/invoices";

const navItems: NavItem[] = [
  {
    title: "Invoices",
    href: INDEX_PAGE,
    icon: FileText,
  },
  {
    title: "Clients",
    href: `${INDEX_PAGE}/clients`,
    icon: Users,
  },
  {
    title: "Reports",
    href: `${INDEX_PAGE}/dashboard`,
    icon: PieChart,
  },
  {
    title: "Settings",
    href: '/profile',
    icon: Settings,
  },
]

export function InvoiceHeader() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur transition-all duration-200">
      <div className="flex flex-row items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold">InvoiceApp</span>
        </Link>
          
        <nav className="ml-6 hidden md:flex">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 items-center gap-2 px-4 text-sm font-medium transition-colors hover:text-foreground",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                  {(pathname === item.href || pathname.startsWith(`${item.href}/`)) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton userProfileUrl="/profile" />
        </SignedIn>
      </div>
    </nav>
  );
}
