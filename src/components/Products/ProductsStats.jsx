import StatCard from "../Cards/StatCard";

const PRODUCT_STAT_ICONS = {
  total: [
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
    "M3.27 6.96L12 12.01l8.73-5.05",
    "M12 22.08V12",
  ],
  stock: [
    "M3 3h18v4H3z",
    "M5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7",
    "M10 12h4",
  ],
  alert: [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
  category: [
    "M3 3h7v7H3z",
    "M14 3h7v7h-7z",
    "M14 14h7v7h-7z",
    "M3 14h7v7H3z",
  ],
};

export default function ProductsStats({ summary }) {
  const stats = [
    {
      label: "Total Productos",
      value: summary.totalProducts,
      colorClass: "accent",
      delay: "delay-1",
      iconPaths: PRODUCT_STAT_ICONS.total,
    },
    {
      label: "Stock Disponible",
      value: summary.totalStock,
      colorClass: "info",
      delay: "delay-2",
      iconPaths: PRODUCT_STAT_ICONS.stock,
    },
    {
      label: "Stock Bajo",
      value: summary.lowStock,
      colorClass: "danger",
      delay: "delay-3",
      iconPaths: PRODUCT_STAT_ICONS.alert,
    },
    {
      label: "Categorías",
      value: summary.categories,
      colorClass: "warning",
      delay: "delay-4",
      iconPaths: PRODUCT_STAT_ICONS.category,
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
