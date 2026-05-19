import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Loader2, Package } from 'lucide-react';
import api from '../services/api';
import { useCategories } from '../hooks/useApi';

const MaterielModal = ({ open, onClose, materiel = null, onSuccess }) => {
    const isEdit = !!materiel;
    const { data: categories, isLoading: catsLoading } = useCategories();

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        categorieId: '',
        quantiteTotale: 0,
        etat: 'neuf',
        seuilAlerte: 5
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    // Reset or populate form
    useEffect(() => {
        if (open) {
            if (materiel) {
                setFormData({
                    nom: materiel.nom || '',
                    description: materiel.description || '',
                    categorieId: materiel.categorie?.id || '',
                    quantiteTotale: materiel.quantiteTotale || 0,
                    etat: materiel.etat || 'neuf',
                    seuilAlerte: materiel.seuilAlerte || 5
                });
            } else {
                setFormData({
                    nom: '',
                    description: '',
                    categorieId: '',
                    quantiteTotale: 0,
                    etat: 'neuf',
                    seuilAlerte: 5
                });
            }
            setErrors({});
            setGlobalError('');
        }
    }, [open, materiel]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantiteTotale' || name === 'seuilAlerte' || name === 'categorieId' 
                ? (value === '' ? '' : parseInt(value) || 0) 
                : value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[name];
                return newErrs;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        if (!formData.categorieId) newErrors.categorieId = 'La catégorie est requise';
        if (formData.quantiteTotale < 0) newErrors.quantiteTotale = 'Quantité invalide';
        if (formData.seuilAlerte < 0) newErrors.seuilAlerte = 'Seuil invalide';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError('');
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await api.put(`/materiels/${materiel.id}`, formData);
            } else {
                await api.post('/materiels', formData);
            }
            onSuccess(isEdit ? 'Matériel mis à jour !' : 'Matériel ajouté !');
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
            setGlobalError(typeof error === 'string' ? error : (error.message || 'Une erreur est survenue'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden shadow-xl">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold leading-tight">
                                {isEdit ? 'Modifier le matériel' : 'Ajouter un matériel'}
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-0.5">
                                {isEdit ? 'Modifiez les informations du matériel sélectionné.' : 'Remplissez les informations pour créer un nouveau matériel.'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {globalError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{globalError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom du matériel</Label>
                        <Input
                            id="nom"
                            name="nom"
                            placeholder="Ex: Ordinateur Portable HP"
                            value={formData.nom}
                            onChange={handleChange}
                            className={errors.nom ? 'border-destructive' : ''}
                        />
                        {errors.nom && <p className="text-xs text-destructive">{errors.nom}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optionnel)</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Détails techniques, marque, etc."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="categorieId">Catégorie</Label>
                            <select
                                id="categorieId"
                                name="categorieId"
                                value={formData.categorieId}
                                onChange={handleChange}
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.categorieId ? 'border-destructive' : ''}`}
                                disabled={catsLoading}
                            >
                                <option value="">Sélectionner...</option>
                                {categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                ))}
                            </select>
                            {errors.categorieId && <p className="text-xs text-destructive">{errors.categorieId}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="etat">État</Label>
                            <select
                                id="etat"
                                name="etat"
                                value={formData.etat}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="neuf">Neuf</option>
                                <option value="usagé">Usagé</option>
                                <option value="défectueux">Défectueux</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantiteTotale">Quantité Totale</Label>
                            <Input
                                id="quantiteTotale"
                                name="quantiteTotale"
                                type="number"
                                min="0"
                                value={formData.quantiteTotale}
                                onChange={handleChange}
                                className={errors.quantiteTotale ? 'border-destructive' : ''}
                            />
                            {errors.quantiteTotale && <p className="text-xs text-destructive">{errors.quantiteTotale}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seuilAlerte">Seuil d'alerte</Label>
                            <Input
                                id="seuilAlerte"
                                name="seuilAlerte"
                                type="number"
                                min="0"
                                value={formData.seuilAlerte}
                                onChange={handleChange}
                                className={errors.seuilAlerte ? 'border-destructive' : ''}
                            />
                            {errors.seuilAlerte && <p className="text-xs text-destructive">{errors.seuilAlerte}</p>}
                        </div>
                    </div>

                    <div className="px-0 py-4 border-t mt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-10"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="flex-[2] h-10"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Enregistrement...
                                </>
                            ) : (
                                isEdit ? 'Modifier' : 'Ajouter le matériel'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MaterielModal;
