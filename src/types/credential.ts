export interface Credential {
  id: string;
  user_id: string;
  machine: string;
  person: string | null;
  service: string;
  username: string | null;
  password: string | null;
  ip_address: string | null;
  port: string | null;
  url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export type CredentialInsert = Omit<Credential, 'id' | 'created_at' | 'updated_at'>;
export type CredentialUpdate = Partial<Omit<Credential, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
