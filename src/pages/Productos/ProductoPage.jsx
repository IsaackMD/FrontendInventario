import { useEffect, useMemo, useState } from "react";
import useProducts from "../../hooks/useProducts";
import ProductsHeader from "../../components/Products/ProductsHeader";
import ProductsStats from "../../components/Products/ProductsStats";
import ProductsTable from "../../components/Products/ProductsTable";
import ProductFormModal from "../../components/Products/ProductFormModal";
import DeleteProductModal from "../../components/Products/DeleteProductModal";
import "./ProductoPage.css";

export default function ProductoPage() {
  const {
    products,
    summary,
    loading,
    saving,
    deletingId,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formModalKey, setFormModalKey] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.sku, product.categoryName, product.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, search]);

  const handleCreateClick = () => {
    setSelectedProduct(null);
    setFormModalKey((current) => current + 1);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormModalKey((current) => current + 1);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleSubmitProduct = async (formData) => {
    try {
      if (selectedProduct?.id) {
        await updateProduct(selectedProduct.id, formData);
      } else {
        await createProduct(formData);
      }

      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch {
      return;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct?.id) return;

    try {
      await deleteProduct(selectedProduct.id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch {
      return;
    }
  };

  const closeFormModal = () => {
    if (saving) return;
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="products-page-shell">
      <ProductsHeader
        search={search}
        onSearchChange={setSearch}
        onCreateClick={handleCreateClick}
        onRefresh={loadProducts}
        loading={loading}
      />

      {error ? (
        <div className="products-feedback-banner products-feedback-error">
          {error}
        </div>
      ) : null}

      <ProductsStats summary={summary} />

      <ProductsTable
        products={filteredProducts}
        loading={loading}
        deletingId={deletingId}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isFormOpen ? (
        <ProductFormModal
          key={formModalKey}
          product={selectedProduct}
          saving={saving}
          onClose={closeFormModal}
          onSubmit={handleSubmitProduct}
        />
      ) : null}

      <DeleteProductModal
        open={isDeleteOpen}
        product={selectedProduct}
        deleting={Boolean(deletingId)}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
