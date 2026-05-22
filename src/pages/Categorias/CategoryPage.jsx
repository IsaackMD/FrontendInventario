import { useEffect, useMemo, useState } from "react";
import StatCard from "../../components/Cards/StatCard";
import useCategory from "../../hooks/useCategory";
import "./CategoryPage.css";

const INITIAL_FORM = {
  name: "",
  description: "",
};

const CATEGORY_STAT_ICONS = {
  total: [
    "M3 3h7v7H3z",
    "M14 3h7v7h-7z",
    "M14 14h7v7h-7z",
    "M3 14h7v7H3z",
  ],
  active: [
    "M20 6L9 17l-5-5",
  ],
  linked: [
    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L12 5",
    "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L12 19",
  ],
  alert: [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
};

function getInitialForm(category) {
  if (!category) return INITIAL_FORM;

  return {
    name: category.name ?? "",
    description: category.description ?? "",
  };
}

function formatDate(dateValue) {
  if (!dateValue) return "Sin registro";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Sin registro";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function CategoryHeader({
  search,
  onSearchChange,
  onCreateClick,
  onRefresh,
  loading,
}) {
  return (
    <section className="products-hero anim-fade-up">
      <div>
        <span className="products-kicker">Catalogo SaaS</span>
        <h1>Categorias</h1>
        <p className="products-subtitle">
          Centraliza tu taxonomia de inventario para mantener datos consistentes
          en todos los modulos.
        </p>
      </div>

      <div className="products-toolbar">
        <div className="products-search">
          <input
            className="input"
            type="search"
            placeholder="Buscar por nombre o descripcion"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <button className="btn btn-ghost" onClick={onRefresh} disabled={loading}>
          {loading ? "Actualizando..." : "Recargar"}
        </button>

        <button className="btn btn-primary" onClick={onCreateClick}>
          Nueva categoria
        </button>
      </div>
    </section>
  );
}

function CategoryStats({ summary }) {
  const stats = [
    {
      label: "Total Categorias",
      value: summary.totalCategories,
      colorClass: "accent",
      delay: "delay-1",
      iconPaths: CATEGORY_STAT_ICONS.total,
    },
    {
      label: "Activas",
      value: summary.activeCategories,
      colorClass: "info",
      delay: "delay-2",
      iconPaths: CATEGORY_STAT_ICONS.active,
    },
    {
      label: "Productos Vinculados",
      value: summary.linkedProducts,
      colorClass: "warning",
      delay: "delay-3",
      iconPaths: CATEGORY_STAT_ICONS.linked,
    },
    {
      label: "Sin Categoria",
      value: summary.uncategorizedProducts,
      colorClass: "danger",
      delay: "delay-4",
      iconPaths: CATEGORY_STAT_ICONS.alert,
    },
  ];

  return (
    <section className="products-stats-grid">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}

function EmptyStateRow({ children }) {
  return (
    <tr>
      <td colSpan="5">
        <div className="products-empty-state">{children}</div>
      </td>
    </tr>
  );
}

function CategoryStatusBadge({ category }) {
  if (!category.isActive) {
    return <span className="badge badge-danger">Inactiva</span>;
  }

  if (category.productCount > 0) {
    return <span className="badge badge-accent">Operativa</span>;
  }

  return <span className="badge badge-warning">Sin uso</span>;
}

function CategoriesTable({
  categories,
  loading,
  deletingId,
  onEdit,
  onDelete,
}) {
  return (
    <section className="card anim-fade-up delay-5">
      <div className="card-header">
        <div>
          <h4>Gobierno de categorias</h4>
          <p className="products-card-caption">
            Administra el catalogo maestro que alimenta productos y reportes.
          </p>
        </div>
        <span className="badge badge-muted">{categories.length} registros</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Alta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EmptyStateRow>
                <div className="spinner" />
                <span>Cargando categorias...</span>
              </EmptyStateRow>
            ) : null}

            {!loading && categories.length === 0 ? (
              <EmptyStateRow>
                <span>No hay categorias para mostrar.</span>
              </EmptyStateRow>
            ) : null}

            {!loading
              ? categories.map((category) => {
                  const isDeleting = deletingId === category.id;

                  return (
                    <tr key={category.id}>
                      <td>
                        <div className="products-cell-stack">
                          <strong>{category.name || "Sin nombre"}</strong>
                          <span>{category.description || "Sin descripcion"}</span>
                        </div>
                      </td>
                      <td>{category.productCount}</td>
                      <td>
                        <CategoryStatusBadge category={category} />
                      </td>
                      <td>{formatDate(category.createdAt)}</td>
                      <td>
                        <div className="products-actions">
                          <button
                            className="btn btn-ghost products-action-btn"
                            onClick={() => onEdit(category)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger products-action-btn"
                            onClick={() => onDelete(category)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CategoryFormModal({ category, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(() => getInitialForm(category));

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="products-modal-overlay" role="presentation">
      <div className="products-modal products-modal-sm card anim-fade-in" role="dialog" aria-modal="true">
        <div className="card-header">
          <div>
            <h4>{category ? "Editar categoria" : "Nueva categoria"}</h4>
            <p className="products-card-caption">
              Define el nombre y la descripcion operativa para el catalogo.
            </p>
          </div>
          <button className="btn btn-ghost products-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <form className="products-form" onSubmit={handleSubmit}>
          <div className="products-form-grid">
            <div className="products-form-span">
              <label htmlFor="category-name">Nombre</label>
              <input
                id="category-name"
                className="input"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                maxLength="80"
                required
              />
            </div>

            <div className="products-form-span">
              <label htmlFor="category-description">Descripcion</label>
              <textarea
                id="category-description"
                className="input products-textarea"
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
                rows="4"
                maxLength="240"
              />
            </div>
          </div>

          <div className="products-modal-actions">
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Guardando..." : category ? "Guardar cambios" : "Crear categoria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteCategoryModal({
  open,
  category,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!open || !category) return null;

  return (
    <div className="products-modal-overlay" role="presentation">
      <div className="products-modal products-modal-sm card anim-fade-in" role="dialog" aria-modal="true">
        <div className="card-header">
          <div>
            <h4>Eliminar categoria</h4>
            <p className="products-card-caption">
              Esta accion impacta la organizacion del catalogo.
            </p>
          </div>
        </div>

        <div className="products-form">
          <div className="products-delete-copy">
            <p>
              Vas a desactivar <strong>{category.name}</strong>.
            </p>
            <p>
              Si aun tiene productos asociados, revisa primero la reasignacion
              para no dejar inventario sin clasificar.
            </p>
          </div>

          <div className="products-modal-actions">
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-danger" type="button" onClick={onConfirm} disabled={deleting}>
              {deleting ? "Eliminando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const {
    categories,
    loading,
    saving,
    deletingId,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formModalKey, setFormModalKey] = useState(0);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) =>
      [category.name, category.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [categories, search]);

  const handleCreateClick = () => {
    setSelectedCategory(null);
    setFormModalKey((current) => current + 1);
    setIsFormOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormModalKey((current) => current + 1);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSubmitCategory = async (formData) => {
    try {
      if (selectedCategory?.id) {
        await updateCategory(selectedCategory.id, formData);
      } else {
        await createCategory(formData);
      }

      setIsFormOpen(false);
      setSelectedCategory(null);
    } catch {
      return;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory?.id) return;

    try {
      await deleteCategory(selectedCategory.id);
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch {
      return;
    }
  };

  const closeFormModal = () => {
    if (saving) return;
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setIsDeleteOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="products-page-shell">
      <CategoryHeader
        search={search}
        onSearchChange={setSearch}
        onCreateClick={handleCreateClick}
        onRefresh={loadCategories}
        loading={loading}
      />

      {error ? (
        <div className="products-feedback-banner products-feedback-error">
          {error}
        </div>
      ) : null}

      {/* <CategoryStats summary={summary} /> */}
{/* 
      <div className="categories-insights-grid">
        <section className="card categories-insight-card anim-fade-up delay-5">
          <div className="card-header">
            <div>
              <h4>Estandar de operacion</h4>
              <p className="products-card-caption">
                Buenas practicas para un catalogo SaaS mas estable.
              </p>
            </div>
          </div>

          <div className="categories-playbook">
            <article className="categories-playbook-item">
              <strong>Nombres canonicos</strong>
              <p>Evita duplicados y variantes que rompen reportes y filtros.</p>
            </article>
            <article className="categories-playbook-item">
              <strong>Descripcion funcional</strong>
              <p>Documenta cuando debe usarse cada categoria para el equipo.</p>
            </article>
            <article className="categories-playbook-item">
              <strong>Depuracion segura</strong>
              <p>Desactiva categorias con validaciones antes de borrarlas del flujo.</p>
            </article>
          </div>
        </section>

        <section className="card categories-insight-card anim-fade-up delay-6">
          <div className="card-header">
            <div>
              <h4>Salud del catalogo</h4>
              <p className="products-card-caption">
                Visibilidad rapida para decisiones de gobernanza.
              </p>
            </div>
          </div>

          <div className="categories-health-list">
            <div className="categories-health-row">
              <span>Categorias activas</span>
              <strong>{summary.activeCategories}</strong>
            </div>
            <div className="categories-health-row">
              <span>Productos categorizados</span>
              <strong>{summary.linkedProducts}</strong>
            </div>
            <div className="categories-health-row">
              <span>Productos pendientes</span>
              <strong className="text-warning">{summary.uncategorizedProducts}</strong>
            </div>
          </div>
        </section>
      </div> */}

      <CategoriesTable
        categories={filteredCategories}
        loading={loading}
        deletingId={deletingId}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isFormOpen ? (
        <CategoryFormModal
          key={formModalKey}
          category={selectedCategory}
          saving={saving}
          onClose={closeFormModal}
          onSubmit={handleSubmitCategory}
        />
      ) : null}

      <DeleteCategoryModal
        open={isDeleteOpen}
        category={selectedCategory}
        deleting={Boolean(deletingId)}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
