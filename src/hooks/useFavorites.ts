import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'raposo_favorite_vehicles';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Erro ao salvar favoritos:', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (vehicleId: string) => {
    setFavoriteIds(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  const isFavorite = (vehicleId: string) => {
    return favoriteIds.includes(vehicleId);
  };

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    favoritesCount: favoriteIds.length,
  };
}
