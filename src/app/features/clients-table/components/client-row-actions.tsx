import { Edit2, Trash2 } from 'lucide-react';
import { useClientDeleteMutation } from '~/entities/client/api/client.api';
import { type ClientModel } from '~/entities/client/model/client.model';
import { ClientModal } from '~/features/client-combobox/components/client-modal/client-modal';
import { ConfirmRemoveModal } from '~/features/confirm-remove-modal';
import { Button } from '~/shared/components/button/button';

interface Props {
  client: ClientModel;
}

export function ClientRowActions({ client }: Props) {
  const deleteClient = useClientDeleteMutation();
  
  return (
    <div className="flex space-x-2">
    <ClientModal buttonClassName="bg-blue-600 hover:bg-blue-700 text-white" client={client}>
      <Button variant="outline" size="icon">
        <Edit2 className="h-4 w-4" />
      </Button>
    </ClientModal>
    
    <ConfirmRemoveModal
      message={"Are you sure you want to remove this client? This action cannot be undone. This will also remove all related invoices."}
      handleConfirm={() => deleteClient.mutateAsync(client.id)}
    >
      <Button variant="outline" size="icon">
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </ConfirmRemoveModal>
  </div>
  );
}