interface Props {
  children: React.ReactElement;
  title: string;
}

export function InvoiceHeader({ children, title }: Props) {
  return (
    <div className="flex items-center justify-between">
      <p>{title}</p>
      <div className="space-x-2">{children}</div>
    </div>
  );
}
