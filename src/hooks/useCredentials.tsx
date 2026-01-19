import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Credential, CredentialInsert, CredentialUpdate } from '@/types/credential';
import { toast } from 'sonner';

export function useCredentials() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCredentials = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .order('machine', { ascending: true });
    
    if (error) {
      toast.error('Erreur lors du chargement des accès');
      console.error(error);
    } else {
      setCredentials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCredentials();
  }, [user]);

  const addCredential = async (credential: Omit<CredentialInsert, 'user_id'>) => {
    if (!user) return { error: new Error('Non authentifié') };

    const { data, error } = await supabase
      .from('credentials')
      .insert({ ...credential, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de l\'ajout');
      return { error };
    }

    setCredentials(prev => [...prev, data]);
    toast.success('Accès ajouté avec succès');
    return { data };
  };

  const updateCredential = async (id: string, updates: CredentialUpdate) => {
    const { data, error } = await supabase
      .from('credentials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return { error };
    }

    setCredentials(prev => prev.map(c => c.id === id ? data : c));
    toast.success('Accès mis à jour');
    return { data };
  };

  const deleteCredential = async (id: string) => {
    const { error } = await supabase
      .from('credentials')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return { error };
    }

    setCredentials(prev => prev.filter(c => c.id !== id));
    toast.success('Accès supprimé');
    return {};
  };

  return {
    credentials,
    loading,
    addCredential,
    updateCredential,
    deleteCredential,
    refetch: fetchCredentials
  };
}
