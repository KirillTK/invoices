import { NoFoundPanel } from '~/features/no-found-panel/ui/no-found';

export default function ClientsNotFound() {
  return (
    <NoFoundPanel
      title="Clients Not Found"
      description="We couldn't find the clients you're looking for. It may have been deleted or the link might be incorrect."
    />
  );
}
