import React from 'react';
import {
    Package,
    FileText,
    CheckSquare,
    AlertTriangle,
    Clock,
    Users,
    Layers
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useApi';

const Dashboard = () => {
    const { user, hasAnyRole } = useAuth();
    const navigate = useNavigate();

    const { data, isLoading: statsLoading, error: statsError } = useDashboardStats();

    const currentStats = data?.stats || {};
    const recentDemandes = data?.recent_demandes || [];

    const getRoleSpecificStats = () => {
        const roleStats = [];

        // Stats pour ADMIN seulement
        if (hasAnyRole(['ROLE_ADMIN'])) {
            roleStats.push({
                title: "Utilisateurs",
                value: currentStats.total_utilisateurs || 0,
                icon: Users,
                description: "Comptes enregistrés",
                color: "blue"
            });
        }

        // Stats pour COMPTABLE MATIERE (et ADMIN via hiérarchie)
        if (hasAnyRole(['ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN'])) {
            roleStats.push(
                {
                    title: "Matériels",
                    value: currentStats.total_materiels || 0,
                    icon: Package,
                    description: "Articles en stock",
                    color: "green"
                },
                {
                    title: "Catégories",
                    value: currentStats.total_categories || 0,
                    icon: Layers,
                    description: "Familles de produits",
                    color: "purple"
                }
            );
        }

        // Stats communes à tous (Demandes)
        roleStats.push({
            title: "Demandes",
            value: currentStats.total_demandes || 0,
            icon: FileText,
            description: hasAnyRole(['ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN']) ? "Toutes les demandes" : "Mes demandes",
            color: "orange",
            urgent: !hasAnyRole(['ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN']) && currentStats.total_demandes > 0
        });

        return roleStats;
    };

    const roleStats = getRoleSpecificStats();

    if (statsError) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Bonjour, {user?.email}
                        </h1>
                        <p className="text-muted-foreground">
                            Erreur lors du chargement des données.
                        </p>
                    </div>
                </div>

                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <p className="text-sm text-red-700">
                                Impossible de charger les statistiques : {statsError instanceof Error ? statsError.message : typeof statsError === 'object' ? JSON.stringify(statsError) : String(statsError)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Bonjour, {user?.email}
                    </h1>
                    <p className="text-muted-foreground">
                        Voici un aperçu de vos activités
                        {statsLoading && " (chargement...)"}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => navigate('/requests/new')} size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Nouvelle demande
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {roleStats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={index} className={`${stat.urgent ? 'border-orange-200 shadow-sm' : ''}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.color === 'blue' ? 'bg-blue-100' :
                                        stat.color === 'green' ? 'bg-green-100' :
                                            stat.color === 'orange' ? 'bg-orange-100' :
                                                stat.color === 'purple' ? 'bg-purple-100' :
                                                    'bg-red-100'
                                    }`}>
                                    <Icon className={`w-4 h-4 ${stat.color === 'blue' ? 'text-blue-600' :
                                            stat.color === 'green' ? 'text-green-600' :
                                                stat.color === 'orange' ? 'text-orange-600' :
                                                    stat.color === 'purple' ? 'text-purple-600' :
                                                        'text-red-600'
                                        }`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {statsLoading ? "..." : stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {recentDemandes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Activités récentes</CardTitle>
                        <CardDescription>Les 5 dernières demandes effectuées</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentDemandes.map((demande) => (
                                <div key={demande.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <Clock className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Demande #{demande.id}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(demande.dateCreation).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${demande.statut === 'APPROUVEE' ? 'bg-green-100 text-green-700' :
                                                demande.statut === 'REJETEE' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {demande.statut}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="link"
                            className="w-full mt-4 text-sm"
                            onClick={() => navigate('/requests')}
                        >
                            Voir toutes les demandes
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Dashboard;
