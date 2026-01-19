import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredentials } from '@/hooks/useCredentials';
import { Credential } from '@/types/credential';
import { Button } from '@/components/ui/button';
import { CredentialCard } from '@/components/CredentialCard';
import { CredentialForm } from '@/components/CredentialForm';
import { SearchBar } from '@/components/SearchBar';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Shield, Plus, LogOut, Loader2, Database } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { credentials, loading: credentialsLoading, addCredential, updateCredential, deleteCredential } = useCredentials();
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('machine');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  // Filter and sort credentials
  const filteredCredentials = useMemo(() => {
    let filtered = credentials;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.machine.toLowerCase().includes(searchLower) ||
        c.service.toLowerCase().includes(searchLower) ||
        c.person?.toLowerCase().includes(searchLower) ||
        c.username?.toLowerCase().includes(searchLower) ||
        c.ip_address?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'service':
          return a.service.localeCompare(b.service);
        case 'person':
          return (a.person || '').localeCompare(b.person || '');
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return a.machine.localeCompare(b.machine);
      }
    });
  }, [credentials, search, sortBy, filterStatus]);

  const handleEdit = (credential: Credential) => {
    setEditingCredential(credential);
    setFormOpen(true);
  };

  const handleSave = async (data: Omit<Credential, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingCredential) {
      await updateCredential(editingCredential.id, data);
    } else {
      await addCredential(data);
    }
    setEditingCredential(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCredential(deleteId);
      setDeleteId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/5 -z-10" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center animate-pulse-glow">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Vault Access</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => { setEditingCredential(null); setFormOpen(true); }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Search and filters */}
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            {filteredCredentials.length} accès
          </span>
          {filterStatus !== 'all' && (
            <span className="text-primary">
              Filtre: {filterStatus}
            </span>
          )}
        </div>

        {/* Credentials grid */}
        {credentialsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Aucun accès trouvé</p>
              <p className="text-muted-foreground">
                {search || filterStatus !== 'all' 
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par ajouter votre premier accès'}
              </p>
            </div>
            {!search && filterStatus === 'all' && (
              <Button
                onClick={() => { setEditingCredential(null); setFormOpen(true); }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un accès
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      <CredentialForm
        credential={editingCredential}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingCredential(null); }}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={credentials.find(c => c.id === deleteId)?.service}
      />
    </div>
  );
}
