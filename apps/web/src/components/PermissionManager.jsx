import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const PermissionManager = ({ member, onUpdate }) => {
  const [permissions, setPermissions] = useState(member?.permissions || {
    view: true,
    comment: false,
    edit: false,
    share: false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(member.id, permissions);
      }
      toast({
        title: 'Permissions updated',
        description: 'Member permissions have been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const permissionOptions = [
    { key: 'view', label: 'View memories', description: 'Can view all shared memories' },
    { key: 'comment', label: 'Comment', description: 'Can add comments to memories' },
    { key: 'edit', label: 'Edit', description: 'Can edit memory details and metadata' },
    { key: 'share', label: 'Share', description: 'Can share memories with others' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-card-foreground font-sans">Manage permissions</h3>
      </div>

      <div className="space-y-4">
        {permissionOptions.map((option) => (
          <div key={option.key} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
            <Checkbox
              id={option.key}
              checked={permissions[option.key]}
              onCheckedChange={() => handleToggle(option.key)}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor={option.key} className="font-medium text-card-foreground cursor-pointer">
                {option.label}
              </label>
              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={loading} className="w-full font-semibold">
        <Check className="w-4 h-4 mr-2" />
        {loading ? 'Saving...' : 'Save permissions'}
      </Button>
    </div>
  );
};

export default PermissionManager;