import { useCallback, useState } from "react";
import {
  createCategoryRequest,
  deleteCategoryRequest,
  fetchCategories,
  updateCategoryRequest,
} from "./service/inventoryService";

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const categorias = await fetchCategories();
      setCategories(categorias);

      return categorias;
    } catch (err) {
      setError(err?.message ?? "No se pudieron cargar las categorias.");
      setCategories([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (formData) => {
      try {
        setSaving(true);
        setError("");

        await createCategoryRequest(formData);
        return await loadCategories();
      } catch (err) {
        setError(err?.message ?? "No se pudo crear la categoria.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [loadCategories],
  );

  const updateCategory = useCallback(
    async (categoryId, formData) => {
      try {
        setSaving(true);
        setError("");

        await updateCategoryRequest(categoryId, formData);
        return await loadCategories();
      } catch (err) {
        setError(err?.message ?? "No se pudo actualizar la categoria.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [loadCategories],
  );

  const deleteCategory = useCallback(
    async (categoryId) => {
      try {
        setDeletingId(categoryId);
        setError("");

        await deleteCategoryRequest(categoryId);
        return await loadCategories();
      } catch (err) {
        setError(err?.message ?? "No se pudo eliminar la categoria.");
        throw err;
      } finally {
        setDeletingId(null);
      }
    },
    [loadCategories],
  );

  return {
    categories,
    loading,
    saving,
    deletingId,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
