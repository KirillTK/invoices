interface Props {
  children: React.ReactNode;
}

export const ErrorField = ({ children }: Props) => (
  <p className="text-red-500 text-sm">{children}</p>
);
