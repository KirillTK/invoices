import { flexRender, type HeaderGroup, type Row } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon, FileText } from 'lucide-react';
import * as React from "react";
import { cn } from "~/shared/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

const TableEmpty = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement> & {
    noItemsText: string;
    noItemsDescription: string;
  }
>(({ children, noItemsText, noItemsDescription }, ref) => (
  <div className="py-10 text-center" ref={ref}>
    <FileText className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-semibold text-gray-900">
      {noItemsText}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {noItemsDescription}
    </p>
    {children && <div className="mt-6">{children}</div>}
  </div>
));
TableEmpty.displayName = "TableEmpty";

const UncontrolledBody = ({ rows }: { rows: Row<unknown>[] }) => {
  return (
    <>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
UncontrolledBody.displayName = "UncontrolledBody";

const UncontrolledHeader = <TData,>({ headers }: { headers: HeaderGroup<TData>[] }) => {
  return (
    <TableHeader>
      {headers.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const isSortable = header.column.getCanSort();

            return (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                colSpan={header.colSpan}
                className={cn(isSortable && 'cursor-pointer')}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: <ArrowUpIcon className="ml-2 h-4 w-4 inline" />,
                  desc: <ArrowDownIcon className="ml-2 h-4 w-4 inline" />,
                }[header.column.getIsSorted() as string] ?? null}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};
UncontrolledHeader.displayName = "UncontrolledHeader";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
  UncontrolledBody,
  UncontrolledHeader,
};
