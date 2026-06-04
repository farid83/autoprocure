// useDemandes : à ajouter dans useApi.js → appel GET /api/demandes

import React, { useState } from 'react';
import {
    ClipboardList,
    Search,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    CheckCheck,
    XOctagon,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useDemandes } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import DemandeModal from '../components/DemandeModal';
import DemandeDetailModal from '../components/DemandeDetailModal';

const Demandes = () => {
    const { hasAnyRole } = useAuth();
    const { data: demandes, isLoading, error, refetch } = useDemandes();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingDemande, setViewingDemande] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const getStatutBadge = (statut) => {
        switch (statut) {
            case 'en attente':
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En attente
                    </Badge>
                );
            case 'validée':
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Validée
                    </Badge>
                );
            case 'rejetée':
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 flex items-center gap-1">
                        <XOctagon className="w-3 h-3" /> Rejetée
                    </Badge>
                );
            case 'approuvée':
                return (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approuvée
                    </Badge>
                );
            default:
                return <Badge variant="outline">{statut}</Badge>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Filtre local par recherche sur : nom de l'utilisateur, statut, nom du matériel, catégorie
    const filteredDemandes = demandes?.filter(d => {
        const searchLower = searchTerm.toLowerCase();
        const matchesUser = d.utilisateur?.nom?.toLowerCase().includes(searchLower);
        const matchesStatut = d.statut?.toLowerCase().includes(searchLower);
        const matchesMateriels = d.demandeMateriel?.some(item =>
            item.materiel?.nom?.toLowerCase().includes(searchLower) ||
            item.materiel?.categorie?.nom?.toLowerCase().includes(searchLower)
        );
        return matchesUser || matchesStatut || matchesMateriels;
    });

    const handleNewRequestSuccess = () => {
        setFeedback({ type: 'success', message: 'Demande envoyée !' });
        refetch();
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleViewDetails = (demande) => {
        console.log('Voir demande', demande);
        setViewingDemande(demande);
    };

    const showFAB = !hasAnyRole(['ROLE_ADMIN', 'ROLE_COMPTABLE_MATIERE']);
    const isStaff = hasAnyRole(['ROLE_ADMIN', 'ROLE_COMPTABLE_MATIERE']);

    return (
        <div className="p-4 md:p-6 space-y-6 relative min-h-[calc(100vh-64px)]">
            {/* Header section */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                        <ClipboardList className="w-8 h-8 text-primary" />
                        Gestion des Demandes
                    </h1>
                    <p className="text-muted-foreground">
                        Consultez et suivez l'état des demandes de matériel.
                    </p>
                </div>
            </div>

            {/* Feedback Message */}
            {feedback && (
                <Alert className={`${feedback.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-in fade-in slide-in-from-top-2`}>
                    {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                    <AlertDescription className={feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {feedback.message}
                    </AlertDescription>
                </Alert>
            )}

            {/* Search and Filters */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher un demandeur, un statut, un matériel..."
                    className="pl-10 h-11 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium font-medium">Chargement des demandes...</p>
                </div>
            ) : error ? (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-sm text-red-700">
                                Impossible de charger les demandes : {error instanceof Error ? error.message : typeof error === 'object' ? JSON.stringify(error) : String(error)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : filteredDemandes?.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-foreground">Aucune demande trouvée</h3>
                    <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou créez une nouvelle demande.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDemandes?.map((demande) => {
                        const items = demande.demandeMateriel || [];
                        const displayedItems = items.slice(0, 2);
                        const extraCount = items.length - 2;
                        const totalQty = items.reduce((sum, item) => sum + (item.quantiteDemandee || 0), 0);

                        return (
                            <Card key={demande.id} className="group hover:shadow-md transition-all duration-200 border-border/50 flex flex-col justify-between">
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start gap-2">
                                        {getStatutBadge(demande.statut)}
                                        <CardDescription className="text-xs">
                                            {formatDate(demande.createdAt)}
                                        </CardDescription>
                                    </div>
                                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors mt-2">
                                        {isStaff ? (demande.utilisateur?.nom || "Utilisateur inconnu") : "Ma demande"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                                    {/* Items List */}
                                    <div className="space-y-1.5 py-2">
                                        {displayedItems.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground truncate max-w-[80%]">
                                                    {item.materiel?.nom || "Matériel inconnu"}
                                                </span>
                                                <span className="font-semibold text-foreground shrink-0">
                                                    × {item.quantiteDemandee}
                                                </span>
                                            </div>
                                        ))}
                                        {extraCount > 0 && (
                                            <p className="text-xs text-muted-foreground italic">
                                                et {extraCount} autre{extraCount > 1 ? 's' : ''}...
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer Info & Actions */}
                                    <div className="flex justify-between items-center pt-4 border-t border-border/50 mt-auto">
                                        <Badge variant="outline" className="text-xs font-medium">
                                            Total : {totalQty} article{totalQty > 1 ? 's' : ''}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                            onClick={() => handleViewDetails(demande)}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Voir
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Floating Action Button for simple user */}
            {showFAB && (
                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-200 z-50 p-0"
                    onClick={() => setIsModalOpen(true)}
                    title="Nouvelle demande"
                >
                    <Plus className="w-6 h-6 text-primary-foreground" />
                </Button>
            )}

            {/* Modal de demande */}
            <DemandeModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleNewRequestSuccess}
            />

            {/* Modal de détails de la demande */}
            <DemandeDetailModal
                open={!!viewingDemande}
                onClose={() => setViewingDemande(null)}
                demande={viewingDemande}
            />
        </div>
    );
};

export default Demandes;
