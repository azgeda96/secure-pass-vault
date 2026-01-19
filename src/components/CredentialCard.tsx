import { useState } from 'react';
import { Credential } from '@/types/credential';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, EyeOff, Copy, ExternalLink, Pencil, Trash2, 
  Server, User, Globe, Network, Check 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CredentialCardProps {
  credential: Credential;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export function CredentialCard({ credential, onEdit, onDelete }: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusClass = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'en ligne':
        return 'status-online';
      case 'local':
        return 'status-local';
      default:
        return 'status-offline';
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 glow-border animate-fade-in hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{credential.service}</h3>
            <p className="text-sm text-muted-foreground truncate">{credential.machine}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {credential.status && (
            <Badge variant="outline" className={cn('text-xs border', getStatusClass(credential.status))}>
              {credential.status}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(credential)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(credential.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {credential.person && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Personne:</span>
            <span className="text-foreground truncate">{credential.person}</span>
          </div>
        )}

        {credential.username && (
          <div className="flex items-center gap-2 text-sm group">
            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">User:</span>
            <span className="text-foreground font-mono truncate flex-1">{credential.username}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(credential.username!, 'username')}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied === 'username' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        )}

        {credential.password && (
          <div className="flex items-center gap-2 text-sm group col-span-full">
            <div className="w-4 h-4 flex-shrink-0" />
            <span className="text-muted-foreground">Password:</span>
            <span className="text-foreground font-mono truncate flex-1">
              {showPassword ? credential.password : '••••••••••••'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="h-6 w-6"
            >
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(credential.password!, 'password')}
              className="h-6 w-6"
            >
              {copied === 'password' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        )}

        {credential.ip_address && (
          <div className="flex items-center gap-2 text-sm group">
            <Network className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">IP:</span>
            <span className="text-foreground font-mono">{credential.ip_address}</span>
            {credential.port && <span className="text-muted-foreground">:{credential.port}</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(credential.ip_address!, 'ip')}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied === 'ip' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        )}

        {credential.url && credential.url !== '--------' && (
          <div className="flex items-center gap-2 text-sm group col-span-full">
            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">URL:</span>
            <a 
              href={credential.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate flex-1"
            >
              {credential.url.replace(/^https?:\/\//, '')}
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(credential.url!, '_blank')}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
