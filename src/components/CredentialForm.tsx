import { useState, useEffect } from 'react';
import { Credential } from '@/types/credential';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Save, X } from 'lucide-react';

interface CredentialFormProps {
  credential?: Credential | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Credential, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

const emptyForm = {
  machine: '',
  person: '',
  service: '',
  username: '',
  password: '',
  ip_address: '',
  port: '',
  url: '',
  status: 'Local',
};

export function CredentialForm({ credential, open, onClose, onSave }: CredentialFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (credential) {
      setForm({
        machine: credential.machine || '',
        person: credential.person || '',
        service: credential.service || '',
        username: credential.username || '',
        password: credential.password || '',
        ip_address: credential.ip_address || '',
        port: credential.port || '',
        url: credential.url || '',
        status: credential.status || 'Local',
      });
    } else {
      setForm(emptyForm);
    }
  }, [credential, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {credential ? 'Modifier l\'accès' : 'Nouvel accès'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="machine" className="text-sm text-muted-foreground">Machine *</Label>
              <Input
                id="machine"
                value={form.machine}
                onChange={(e) => handleChange('machine', e.target.value)}
                placeholder="Debian-network"
                required
                className="bg-input border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm text-muted-foreground">Service *</Label>
              <Input
                id="service"
                value={form.service}
                onChange={(e) => handleChange('service', e.target.value)}
                placeholder="Portainer"
                required
                className="bg-input border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="person" className="text-sm text-muted-foreground">Personne</Label>
              <Input
                id="person"
                value={form.person}
                onChange={(e) => handleChange('person', e.target.value)}
                placeholder="Régis"
                className="bg-input border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm text-muted-foreground">Statut</Label>
              <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="En ligne">En ligne</SelectItem>
                  <SelectItem value="Hors ligne">Hors ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-muted-foreground">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="admin"
                className="bg-input border-border focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Mot de passe</Label>
              <Input
                id="password"
                type="text"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                className="bg-input border-border focus:border-primary font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip_address" className="text-sm text-muted-foreground">Adresse IP</Label>
              <Input
                id="ip_address"
                value={form.ip_address}
                onChange={(e) => handleChange('ip_address', e.target.value)}
                placeholder="192.168.1.20"
                className="bg-input border-border focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port" className="text-sm text-muted-foreground">Port</Label>
              <Input
                id="port"
                value={form.port}
                onChange={(e) => handleChange('port', e.target.value)}
                placeholder="8080"
                className="bg-input border-border focus:border-primary font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm text-muted-foreground">URL</Label>
            <Input
              id="url"
              value={form.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://example.com"
              className="bg-input border-border focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground">
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {credential ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
