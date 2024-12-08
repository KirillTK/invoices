'use client';

import { Search } from 'lucide-react';
import { Input } from '~/shared/components/input';
import { Card, CardContent } from "~/shared/components/card/card";
import { type ChangeEvent } from 'react';


interface Props {
  value: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder }: Props) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
          <Input className="pl-10" placeholder={placeholder} value={value} onChange={onChange} />
        </div>
      </CardContent>
    </Card>
  );
};
