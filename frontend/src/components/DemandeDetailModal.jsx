import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    ClipboardList,
    User,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Package,
    UserCheck,
    ShieldCheck
} from 'lucide-react';

const DemandeDetailModal = ({ open, onClose, demande }) => {
    if (!demande) return null;

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
                        <CheckCircle2 className="w-3 h-3" /> Validée
                    </Badge>
                );
            case 'rejetée':
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rejetée
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

    const getItemStatutBadge = (statut) => {
        switch (statut) {
            case 'en attente':
                return <Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-600 border-yellow-200">En attente</Badge>;
            case 'accordée':
                return <Badge variant="outline" className="text-[10px] bg-green-50 text-green-600 border-green-200">Accordée</Badge>;
            case 'rejetée':
                return <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-200">Rejetée</Badge>;
            default:
                return <Badge variant="outline" className="text-[10px]">{statut}</Badge>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non renseignée';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const items = demande.demandeMateriel || demande.demandeMateriels || [];

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden shadow-xl">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <ClipboardList className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold leading-tight">
                                Détails de la demande #{demande.id}
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-0.5">
                                Consultez l'état et le détail des matériels demandés.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {/* Informations Générales */}
                    <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border/55">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Statut global</span>
                            {getStatutBadge(demande.statut)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Demandeur :</span>
                            <span className="font-medium text-foreground">{demande.utilisateur?.nom || demande.utilisateur?.email || 'Inconnu'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Créée le :</span>
                            <span className="font-medium text-foreground">{formatDate(demande.dateCreation || demande.createdAt)}</span>
                        </div>
                    </div>

                    {/* Matériels Demandés */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            Matériels demandés
                        </h4>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-col p-3 rounded-lg border bg-card space-y-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="font-semibold text-sm text-foreground">
                                            {item.materiel?.nom || 'Matériel inconnu'}
                                        </span>
                                        {getItemStatutBadge(item.statut)}
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Quantité demandée : <strong className="text-foreground">{item.quantiteDemandee}</strong></span>
                                        {item.quantiteAccordee !== null && item.quantiteAccordee !== undefined && (
                                            <span>Quantité accordée : <strong className="text-foreground">{item.quantiteAccordee}</strong></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section Validation (Comptable Matière) */}
                    {demande.comptableMatiere && (
                        <div className="space-y-3 pt-3 border-t border-border/50">
                            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-green-600" />
                                Validation (Comptable Matière)
                            </h4>
                            <div className="text-xs space-y-2 bg-green-50/30 p-3 rounded-lg border border-green-100">
                                <p className="text-muted-foreground">
                                    Validé par : <strong className="text-foreground">{demande.comptableMatiere.nom || demande.comptableMatiere.email}</strong> le {formatDate(demande.dateValidation)}
                                </p>
                                <div className="p-2 bg-white rounded border border-green-50">
                                    <span className="text-muted-foreground block mb-0.5">Commentaire :</span>
                                    <p className="text-foreground italic">"{demande.commentaireValidation || 'Aucun commentaire.'}"</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section Approbation (Administrateur) */}
                    {demande.administrateur && (
                        <div className="space-y-3 pt-3 border-t border-border/50">
                            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                Approbation (Administrateur)
                            </h4>
                            <div className="text-xs space-y-2 bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                                <p className="text-muted-foreground">
                                    Décision par : <strong className="text-foreground">{demande.administrateur.nom || demande.administrateur.email}</strong> le {formatDate(demande.dateApprobation)}
                                </p>
                                <div className="p-2 bg-white rounded border border-blue-50">
                                    <span className="text-muted-foreground block mb-0.5">Commentaire :</span>
                                    <p className="text-foreground italic">"{demande.commentaireApprobation || 'Aucun commentaire.'}"</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-muted/30 flex justify-end">
                    <Button variant="outline" className="w-full sm:w-28 h-10" onClick={onClose}>
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DemandeDetailModal;
