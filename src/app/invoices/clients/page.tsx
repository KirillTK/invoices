'use client'

import { useState } from 'react';
import { PlusIcon, Search, Edit2, Trash2 } from 'lucide-react';
import { NewClientModal } from '~/features/client-combobox/components/new-client-modal';
import { type ClientModel } from '~/entities/client/model/client.model';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/card/card';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '~/shared/components/table/table';
import { Input } from '~/shared/components/input';
import { Button } from '~/shared/components/button';

const clients: ClientModel[] = [
  { id: '1', name: 'Acme Corp', taxIndex: '123456789', country: 'USA', city: 'New York', address: '123 Broadway', zip: '10001' },
  { id: '2', name: 'Globex Corporation', taxIndex: '987654321', country: 'Canada', city: 'Toronto', address: '456 King St', zip: 'M5V 1K4' },
  // Add more sample clients as needed
] as ClientModel[]

export default function ClientsPage() {
  const [, setEditingClient] = useState<ClientModel | null>(null);

  const handleEditClient = (client: ClientModel) => {
    setEditingClient(client);
  };

  const handleDeleteClient = (clientId: string) => {
    // Implement delete functionality
    console.log('Delete client', clientId);
  };


  return (
    <div className="container mx-auto p-4">
      <div 
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <NewClientModal buttonClassName="bg-blue-600 hover:bg-blue-700 text-white">
          <Button><PlusIcon className="mr-2 h-4 w-4" /> Add Client</Button>
        </NewClientModal>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" placeholder="Search clients..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tax Index</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.taxIndex}</TableCell>
                  <TableCell>{client.country}</TableCell>
                  <TableCell>{client.city}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditClient(client)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteClient(client.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}