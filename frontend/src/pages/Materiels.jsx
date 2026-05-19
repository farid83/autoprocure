import React, { useState } from 'react';
import { 
    Package, 
    Plus, 
    Pencil, 
    Trash2, 
    Search, 
    AlertCircle, 
    MoreVertical,
    CheckCircle2,
    XCircle,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useMateriels } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import MaterielModal from '../components/MaterielModal';
import api from '../services/api';
import { Alert, AlertDescription } from '../components/ui/alert';

const Materiels = () => {
    const { hasAnyRole } = useAuth();
    const { data: materiels, isLoading, error, refetch } = useMateriels();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMateriel, setEditingMateriel] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const filteredMateriels = materiels?.filter(m => 
        m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.categorie?.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setEditingMateriel(null);
        setIsModalOpen(true);
    };

    const handleEdit = (materiel) => {
        setEditingMateriel(materiel);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
            try {
                await api.delete(`/materiels/${id}`);
                setFeedback({ type: 'success', message: 'Matériel supprimé avec succès' });
                refetch();
                setTimeout(() => setFeedback(null), 3000);
            } catch (err) {
                setFeedback({ type: 'error', message: typeof err === 'string' ? err : 'Erreur lors de la suppression' });
                setTimeout(() => setFeedback(null), 5000);
            }
        }
    };

    const handleModalSuccess = (message) => {
        setFeedback({ type: 'success', message });
        refetch();
        setTimeout(() => setFeedback(null), 3000);
    };

    const getEtatBadge = (etat) => {
        switch (etat) {
            case 'neuf': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Neuf</Badge>;
            case 'usagé': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">Usagé</Badge>;
            case 'défectueux': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">Défectueux</Badge>;
            default: return <Badge variant="outline">{etat}</Badge>;
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 relative min-h-[calc(100vh-64px)]">
            {/* Header section */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                        <Package className="w-8 h-8 text-primary" />
                        Gestion des Matériels
                    </h1>
                    <p className="text-muted-foreground">
                        Consultez et gérez l'inventaire des équipements.
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
                    placeholder="Rechercher un matériel, une catégorie..." 
                    className="pl-10 h-11 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium">Chargement du stock...</p>
                </div>
            ) : error ? (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-sm text-red-700">Impossible de charger les matériels : {error instanceof Error ? error.message : typeof error === 'object' ? JSON.stringify(error) : String(error)}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : filteredMateriels?.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-foreground">Aucun matériel trouvé</h3>
                    <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou ajoutez un nouvel article.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMateriels?.map((materiel) => (
                        <Card key={materiel.id} className="group hover:shadow-md transition-all duration-200 border-border/50">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {getEtatBadge(materiel.etat)}
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold">
                                                {materiel.categorie?.nom}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                                            {materiel.nom}
                                        </CardTitle>
                                    </div>
                                    <div className="flex gap-1">
                                        {hasAnyRole(['ROLE_ADMIN', 'ROLE_COMPTABLE_MATIERE']) && (
                                            <>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors shadow-sm bg-white border border-border"
                                                    onClick={() => handleEdit(materiel)}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                {hasAnyRole(['ROLE_ADMIN']) && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm bg-white border border-border"
                                                        onClick={() => handleDelete(materiel.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                    {materiel.description || "Aucune description fournie."}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border/50">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">En Stock</p>
                                        <p className={`text-lg font-bold ${materiel.quantiteDisponible <= materiel.seuilAlerte ? 'text-red-600' : 'text-foreground'}`}>
                                            {materiel.quantiteDisponible} / {materiel.quantiteTotale}
                                        </p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Seuil Alerte</p>
                                        <p className="text-lg font-bold text-muted-foreground">
                                            {materiel.seuilAlerte}
                                        </p>
                                    </div>
                                </div>
                                
                                {materiel.quantiteDisponible <= materiel.seuilAlerte && (
                                    <div className="mt-3 flex items-center gap-1.5 text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-bold uppercase">Stock critique</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Floating Action Button */}
            {hasAnyRole(['ROLE_ADMIN', 'ROLE_COMPTABLE_MATIERE']) && (
                <Button 
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-200 z-50 p-0"
                    onClick={handleAdd}
                >
                    <Plus className="w-6 h-6 text-primary-foreground" />
                </Button>
            )}

            {/* Modals */}
            <MaterielModal 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                materiel={editingMateriel}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
};

export default Materiels;
