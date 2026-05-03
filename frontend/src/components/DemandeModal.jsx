import { useState, useEffect, useRef } from 'react';
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
import { Trash2, Plus, AlertCircle, Loader2, PackageCheck, Check } from 'lucide-react';
import api from '../services/api';

const emptyItem = () => ({
  id: crypto.randomUUID(),
  materielId: null,
  materielNom: '',
  search: '',
  quantite: 1,
  suggestions: [],
  isSearching: false,
  showSuggestions: false,
});

/* ─────────────────────────────────────────────
   Ligne d'item : autocomplete + quantité
───────────────────────────────────────────── */
const ItemRow = ({ item, index, total, onUpdate, onRemove, errors }) => {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounce recherche
  useEffect(() => {
    if (!item.showSuggestions || item.search.length < 2 || item.search === item.materielNom) {
      if (item.suggestions.length > 0) onUpdate({ suggestions: [] });
      return;
    }

    onUpdate({ isSearching: true });
    const timer = setTimeout(async () => {
      try {
        const response = await api.get(`/materiels?search=${encodeURIComponent(item.search)}`);
        onUpdate({
          suggestions: Array.isArray(response) ? response : [],
          isSearching: false,
        });
      } catch {
        onUpdate({ isSearching: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [item.search, item.showSuggestions]);

  const handleSearchChange = (e) => {
    onUpdate({
      search: e.target.value,
      showSuggestions: true,
      materielId: null,
      materielNom: '',
    });
  };

  // ✅ FIX PRINCIPAL : onMouseDown + preventDefault empêche le blur de l'input
  // de se déclencher avant le clic, ce qui fermait la dropdown avant la sélection
  const handleSelectMateriel = (e, materiel) => {
    e.preventDefault(); // empêche le blur de l'input
    onUpdate({
      materielId: materiel.id,
      materielNom: materiel.nom,
      search: materiel.nom,
      showSuggestions: false,
      suggestions: [],
    });
  };

  const handleBlur = () => {
    // Petit délai pour laisser le mousedown se traiter en premier si clic sur suggestion
    setTimeout(() => {
      onUpdate({ showSuggestions: false });
    }, 150);
  };

  const itemError = errors[`item_${index}`];
  const qtyError = errors[`quantite_${index}`];

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-lg border bg-card">

      {/* Numéro */}
      <div className="flex-shrink-0 w-6 h-6 mt-[34px] rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
        {index + 1}
      </div>

      {/* Recherche matériel */}
      <div className="flex-1 space-y-1.5 relative">
        <Label htmlFor={`search-${item.id}`} className="text-sm font-medium">
          Matériel
        </Label>
        <div className="relative">
          <Input
            ref={inputRef}
            id={`search-${item.id}`}
            placeholder="Tapez pour rechercher..."
            value={item.search}
            onChange={handleSearchChange}
            onFocus={() => item.search.length >= 2 && onUpdate({ showSuggestions: true })}
            onBlur={handleBlur}
            className={`h-10 ${itemError ? 'border-destructive' : ''}`}
            autoComplete="off"
          />
          {item.isSearching && (
            <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-muted-foreground" />
          )}
          {item.materielId && !item.isSearching && (
            <Check className="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
          )}
        </div>

        {/* Dropdown suggestions */}
        {item.showSuggestions && item.suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg overflow-hidden"
          >
            {item.suggestions.map((sug) => (
              <div
                key={sug.id}
                // ✅ onMouseDown (pas onClick) pour intercepter avant le blur
                onMouseDown={(e) => handleSelectMateriel(e, sug)}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-accent cursor-pointer border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{sug.nom}</p>
                  <p className="text-xs text-muted-foreground">{sug.categorie}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-3">
                  {sug.quantiteDisponible} dispo.
                </span>
              </div>
            ))}
          </div>
        )}

        {itemError && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {itemError}
          </p>
        )}
      </div>

      {/* Quantité */}
      <div className="space-y-1.5 w-full sm:w-24 shrink-0">
        <Label htmlFor={`quantite-${item.id}`} className="text-sm font-medium">
          Quantité
        </Label>
        <Input
          id={`quantite-${item.id}`}
          type="number"
          min="1"
          value={item.quantite}
          onChange={(e) => onUpdate({ quantite: Math.max(1, parseInt(e.target.value) || 1) })}
          className={`h-10 ${qtyError ? 'border-destructive' : ''}`}
        />
        {qtyError && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {qtyError}
          </p>
        )}
      </div>

      {/* Suppression */}
      <div className="flex-shrink-0 mt-0 sm:mt-[26px]">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
          onClick={() => onRemove(index)}
          disabled={total <= 1}
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Modal principal
───────────────────────────────────────────── */
const DemandeModal = ({ open, onClose }) => {
  const [items, setItems] = useState([emptyItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset à l'ouverture
  useEffect(() => {
    if (open) {
      setItems([emptyItem()]);
      setErrors({});
      setGlobalError('');
      setSuccess('');
    }
  }, [open]);

  const updateItem = (index, updates) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
    // Effacer l'erreur du champ si corrigé
    if (updates.materielId && errors[`item_${index}`]) {
      setErrors((prev) => { const e = { ...prev }; delete e[`item_${index}`]; return e; });
    }
    if (updates.quantite && errors[`quantite_${index}`]) {
      setErrors((prev) => { const e = { ...prev }; delete e[`quantite_${index}`]; return e; });
    }
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    items.forEach((item, i) => {
      if (!item.materielId) newErrors[`item_${i}`] = 'Veuillez sélectionner un matériel';
      if (!item.quantite || item.quantite < 1) newErrors[`quantite_${i}`] = 'Quantité invalide';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setGlobalError('');
    setSuccess('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = {
      items: items.map(({ materielId, quantite }) => ({
        materielId,
        quantite: parseInt(quantite),
      })),
    };

    try {
      await api.post('/demandes', payload);
      setSuccess('Demande envoyée avec succès !');
      setTimeout(() => { onClose(); }, 2000);
    } catch (error) {
      if (error.errors) {
        setGlobalError(Object.values(error.errors).flat().join('. '));
      } else if (error.message) {
        setGlobalError(error.message);
      } else {
        setGlobalError("Une erreur est survenue lors de l'envoi de la demande.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden shadow-xl">

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold leading-tight">
                Nouvelle demande de matériel
              </DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                Sélectionnez les matériels et les quantités souhaitées.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">

          {globalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
              <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {items.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              onUpdate={(updates) => updateItem(index, updates)}
              onRemove={removeItem}
              errors={errors}
            />
          ))}

          <Button
            variant="outline"
            className="w-full h-10 border-dashed text-muted-foreground hover:text-foreground"
            onClick={() => setItems((prev) => [...prev, emptyItem()])}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un matériel
          </Button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-10"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            className="flex-[2] h-10"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer la demande'
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default DemandeModal;