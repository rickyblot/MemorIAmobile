import React from 'react';
import { User, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const FamilyMemberCard = ({ member, onEdit, onRemove }) => {
  const { t } = useLanguage();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-primary text-primary-foreground';
      case 'editor': return 'bg-secondary text-secondary-foreground';
      case 'commenter': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground font-sans">{member.email}</h3>
            <p className="text-sm text-muted-foreground">
              {t('sharing.joined', { date: new Date(member.joinedDate || member.created).toLocaleDateString() })}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(member)}>{t('sharing.editPermissions')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRemove(member)} className="text-destructive">
              {t('sharing.removeMember')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor(member.role)}`}>
          {member.role}
        </span>
        <span className={`text-xs font-medium ${getStatusColor(member.status)}`}>
          {member.status}
        </span>
      </div>
    </div>
  );
};

export default FamilyMemberCard;