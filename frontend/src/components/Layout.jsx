import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Home, Package, FileText, CheckSquare, Users,
    Menu, User as UserIcon,
    LogOut, Moon, Sun, Layers
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoading, logoutAction, hasAnyRole } = useAuth();

    // État pour le mode sombre et le menu mobile
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Menu items avec rôles Symfony
    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['ROLE_USER', 'ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN'] },
        { icon: Package, label: 'Matériels', path: '/materials', roles: ['ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN'] },
        { icon: Layers, label: 'Catégories', path: '/categories', roles: ['ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN'] },
        { icon: FileText, label: 'Demandes', path: '/requests', roles: ['ROLE_USER', 'ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN'] },
        { icon: CheckSquare, label: 'Validations', path: '/validations', roles: ['ROLE_ADMIN'] },
        { icon: Users, label: 'Utilisateurs', path: '/users', roles: ['ROLE_ADMIN'] },
    ];

    const visibleMenuItems = useMemo(() => {
        if (!user) return [];
        return menuItems.filter(item => hasAnyRole(item.roles));
    }, [user, hasAnyRole]);

    const handleLogout = () => {
        logoutAction();
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    const SidebarContent = ({ mobile = false }) => (
        <div className="flex flex-col h-full bg-card">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                        <Package className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground leading-tight">G-Stock</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ministère du Numérique</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {visibleMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (mobile) setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer info */}
            <div className="p-4 border-t border-border mt-auto text-center opacity-50">
                <p className="text-[10px] text-muted-foreground">v1.0.0 © 2026</p>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center space-y-4">
                    <Package className="w-12 h-12 text-primary animate-pulse mx-auto" />
                    <p className="text-muted-foreground animate-pulse">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-background flex ${isDarkMode ? 'dark' : ''}`}>
            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-64 bg-card border-r border-border shrink-0 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64 border-r-0">
                    <SidebarContent mobile />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Header */}
                <header className="bg-card/80 backdrop-blur-md border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        <h2 className="text-lg font-semibold text-foreground hidden sm:block">
                            {visibleMenuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Dark Mode Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="rounded-full"
                        >
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative p-1 h-auto flex items-center gap-2 rounded-full hover:bg-muted pr-2">
                                    <Avatar className="h-8 w-8 border border-border">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                            {user?.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-xs font-semibold truncate max-w-[120px]">{user?.email}</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal p-4">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold">{user?.email}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            {user?.roles?.join(', ')}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/profile')}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span className="text-sm">Profil</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="text-sm">Se déconnecter</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
