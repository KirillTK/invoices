'use client'
import React from 'react';
import { FileText, Users, PieChart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/invoices', icon: FileText, label: 'Invoices' },
  { href: '/invoices/clients', icon: Users, label: 'Clients' },
  { href: '/invoices/dashboard', icon: PieChart, label: 'Reports' },
];

export default function InvoiceSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/invoices' && pathname === '/invoices') return true;
    return pathname.startsWith(path) && path !== '/invoices';
  };

  const isInvoiceDetailRoute = pathname.match(/^\/invoices\/(new|\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/);

  const NavLink = ({ href, icon: Icon, label, className = '' }: { href: string; icon: React.ElementType; label: string; className?: string }) => (
    <li className={className}>
      <Link
        href={href}
        className={`flex items-center space-x-2 p-2 ${
          isActive(href)
            ? 'text-blue-600 bg-blue-50 rounded'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    </li>
  );

  return (
    <nav className="w-44 bg-white p-4 shadow-md" key="test2">
      <ul className="space-y-2" key="test">
        {navItems.map((item) => (
          <React.Fragment key={item.href}>
            <NavLink {...item} />
            {item.href === '/invoices' && isInvoiceDetailRoute && (
              <NavLink
                key={item.href}
                href={pathname}
                icon={FileText}
                label="Invoice"
                className="ml-4"
              />
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}