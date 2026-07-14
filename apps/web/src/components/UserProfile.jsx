import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Shield, HardDrive } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
        <Avatar className="w-10 h-10 border border-border cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background transition-smooth">
          <AvatarImage src={currentUser.avatar ? pb.files.getURL(currentUser, currentUser.avatar) : undefined} alt={currentUser.name} />
          <AvatarFallback className="bg-primary/20 text-primary font-bold">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 bg-popover border-border">
        <DropdownMenuLabel className="flex flex-col p-2">
          <span className="font-semibold text-foreground text-base truncate">{currentUser.name || 'Usuario'}</span>
          <span className="text-xs text-muted-foreground truncate">{currentUser.email}</span>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-md w-fit">
            <Shield className="w-3.5 h-3.5" /> Encriptación Activa
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem asChild className="p-3 cursor-pointer hover:bg-muted focus:bg-muted rounded-md transition-colors">
          <Link to="/dashboard" className="flex items-center gap-3">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span>Almacenamiento</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="p-3 cursor-pointer hover:bg-muted focus:bg-muted rounded-md transition-colors">
          <Link to="/settings" className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>Ajustes y Privacidad</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem onClick={handleLogout} className="p-3 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 rounded-md transition-colors flex items-center gap-3">
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}