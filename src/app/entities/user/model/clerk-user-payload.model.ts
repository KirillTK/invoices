export interface ClerkUserPayload {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses: Array<{
    email_address: string;
    id: string;
    verification: null | {
      status: string;
      strategy: string;
    };
  }>;
  primary_email_address_id: string;
  public_metadata: Record<string, unknown>;
}
