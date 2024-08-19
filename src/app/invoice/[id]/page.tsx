type Props = { params: { id: string } };

export default function Invoice({ params }: Props) {
  return <div>Invoice {params.id}</div>;
}
