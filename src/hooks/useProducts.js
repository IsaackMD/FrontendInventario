import { useCallback, useMemo, useState } from "react";
import api from "./service/api";

const PRODUCTS_ENDPOINT = "/Products";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapProduct(product) {
  return {
    id: product.id,
    name: product.name ?? "",
    description: product.description ?? "",
    sku: product.sku ?? "",
    stock: toNumber(product.stock),
    stockMin: toNumber(product.stockmin),
    price: toNumber(product.price),
    categoryId: product.categoryId ?? "",
    categoryName: product.categoryName ?? "",
  };
}

function parseProductsResponse(response) {
  if (!response?.isSuccess || !Array.isArray(response.value)) {
    return [];
  }

  return response.value.map(mapProduct);
}

function buildProductPayload(formData) {
  return {
    Name: formData.name.trim(),
    Description: formData.description.trim(),
    Stock: toNumber(formData.stock),
    Stockmin: toNumber(formData.stockMin),
    price: toNumber(formData.price),
    CategoryId: formData.categoryId.trim() || null,
  };
}

function getSummary(products) {
  return {
    totalProducts: products.length,
    totalStock: products.reduce((total, product) => total + product.stock, 0),
    lowStock: products.filter(
      (product) => product.stockMin > 0 && product.stock <= product.stockMin,
    ).length,
    categories: new Set(
      products.map((product) => product.categoryName).filter(Boolean),
    ).size,
  };
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]);


  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(PRODUCTS_ENDPOINT);
      const nextProducts = parseProductsResponse(response);
      setProducts(nextProducts);
      return nextProducts;
    } catch (err) {
      const message = err?.message ?? "No se pudieron cargar los productos.";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (formData) => {
      try {
        setSaving(true);
        setError("");

        await api.post(PRODUCTS_ENDPOINT, buildProductPayload(formData));
        return await loadProducts();
      } catch (err) {
        setError(err?.message ?? "No se pudo crear el producto.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [loadProducts],
  );

  const updateProduct = useCallback(
    async (productId, formData) => {
      try {
        setSaving(true);
        setError("");

        const payload = buildProductPayload(formData);

        await api.put(`${PRODUCTS_ENDPOINT}`, { ...payload, Id: productId });
        return await loadProducts();
      } catch (err) {
        setError(err?.message ?? "No se pudo actualizar el producto.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [loadProducts],
  );

  const deleteProduct = useCallback(
    async (productId) => {
      try {
        setDeletingId(productId);
        setError("");

        await api.delete(`${PRODUCTS_ENDPOINT}/${productId}`);
        return await loadProducts();
      } catch (err) {
        setError(err?.message ?? "No se pudo eliminar el producto.");
        throw err;
      } finally {
        setDeletingId(null);
      }
    },
    [loadProducts],
  );

  const loadCategorias = useCallback(() => {
    return (async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/Categories");
        if (response?.isSuccess && Array.isArray(response.value)) {
          setCategorias(response.value);
        } else {
          setCategorias([]);
        }

      } catch (error) {
        setError(error?.message ?? "No se pudieron cargar las categorías.");
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const summary = useMemo(() => getSummary(products), [products]);

  return {
    products,
    categorias,
    summary,
    loading,
    saving,
    deletingId,
    error,
    loadProducts,
    loadCategorias,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
