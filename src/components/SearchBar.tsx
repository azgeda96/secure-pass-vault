import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

export function SearchBar({ 
  search, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  filterStatus,
  onFilterChange 
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par machine, service, personne..."
          className="pl-10 bg-input border-border focus:border-primary"
        />
      </div>
      
      <div className="flex gap-3">
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[140px] bg-input border-border">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="En ligne">En ligne</SelectItem>
            <SelectItem value="Local">Local</SelectItem>
            <SelectItem value="Hors ligne">Hors ligne</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px] bg-input border-border">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="machine">Machine</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="person">Personne</SelectItem>
            <SelectItem value="recent">Plus récent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
