'use client'
import { LayoutDashboard, FileText, Users, PieChart } from 'lucide-react';

export default function InvoiceSidebar() {
  return (
    <nav className="w-64 bg-white p-4 shadow-md">
    <ul className="space-y-2">
      <li>
        <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </a>
      </li>
      <li>
        <a href="#" className="flex items-center space-x-2 text-blue-600 bg-blue-50 rounded p-2">
          <FileText className="h-5 w-5" />
          <span>Invoices</span>
        </a>
      </li>
      <li>
        <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
          <Users className="h-5 w-5" />
          <span>Clients</span>
        </a>
      </li>
      <li>
        <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
          <PieChart className="h-5 w-5" />
          <span>Reports</span>
        </a>
      </li>
    </ul>
  </nav>
  );
}