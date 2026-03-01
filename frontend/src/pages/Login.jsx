import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Package, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
// import { queryKeys } from '../hooks/useApi';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, error: authError, clearError } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        clearError();
    }, []);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (localError) setLocalError("");
        if (authError) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");
        try {
            await login(formData.email, formData.password);
            navigate("/dashboard");
        } catch (err) {
            setLocalError(err);
        }
    };

    const quickLoginButtons = [
        { email: 'jean.dupont@example.com', role: 'Employé', password: 'Password123@' },
        { email: 'marie.koffi@example.com', role: 'CM', password: 'Password123@' },
        { email: 'pierre.akoka@example.com', role: 'CM', password: 'Password123@' },
        { email: 'fatou.tomiyo@example.com', role: 'DAAF', password: 'Password123@' },
        { email: 'ahmed.soumanou@example.com', role: 'Employé', password: 'Password123@' },
        { email: 'admin@example.com', role: 'admin', password: 'Password123@' }
    ];

    const handleQuickLogin = async (email, password) => {
        setFormData({ email, password });
        setLocalError("");

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setLocalError(err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Vérification de la session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">

                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                            <Package className="w-8 h-8 text-primary-foreground" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Ministère du Numérique</h1>
                    <p className="text-muted-foreground">Système de Gestion et d'Acquisition Automatique de Matériels</p>
                </div>


                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center">Connexion</CardTitle>
                        <CardDescription className="text-center">
                            Connectez-vous pour accéder au système
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {(localError || authError) && (
                                <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                                    <AlertDescription className="text-red-800 dark:text-red-200">
                                        {localError || authError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Adresse email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-11 w-11"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Connexion...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <div className="text-center text-sm my-2">
                    Pas encore de compte ?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        S’inscrire
                    </a>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-center">Connexions de démonstration</CardTitle>
                        <CardDescription className="text-center text-sm">
                            Cliquez pour tester avec différents rôles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            {quickLoginButtons.map((user, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickLogin(user.email, user.password)}
                                    disabled={isLoading}
                                    className="justify-start h-10"
                                >
                                    <span className="font-medium mr-2">{user.role}:</span>
                                    <span className="text-muted-foreground text-sm">{user.email}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                    © 2026 Ministère du Numérique - Tous droits réservés
                </div>
            </div>
        </div>
    );
};

export default Login;