import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "~/shared/utils";
import { Button, type ButtonProps, buttonVariants } from '../../button/button';
import { type Table } from '@tanstack/react-table';

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"button">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => {
  return (
    <Button
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "outline",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationTable = <TData,>({ tableInstance }: { tableInstance: Table<TData> }) => {
  const pageCount = tableInstance.getPageCount();
  const currentPage = tableInstance.getState().pagination.pageIndex;

  const renderPageNumbers = () => {
    let start = currentPage;
    if (currentPage === pageCount - 1) {
      start = currentPage - 2;
    } else if (currentPage > 0) {
      start = currentPage - 1;
    }

    const pages = [];
    for (let i = start; i < Math.min(start + 3, pageCount); i++) {
      if (i >= 0) {
        pages.push(
          <PaginationItem key={i + 'pagination-item'}>
            <PaginationLink 
              onClick={() => tableInstance.setPageIndex(i)}
              isActive={i === currentPage}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  return (
    <Pagination className="mt-4 flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => tableInstance.previousPage()}
            disabled={currentPage === 0}
          />
        </PaginationItem>
        
        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext 
            onClick={() => tableInstance.nextPage()}
            disabled={currentPage === pageCount - 1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
PaginationTable.displayName = "PaginationTable";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationTable,
}
