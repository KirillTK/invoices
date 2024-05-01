import type { UseFormRegisterReturn } from 'react-hook-form';

export type UncontrolledInputProps = UseFormRegisterReturn<string>;

export type Option = { id?: string; label: string, value: string };
