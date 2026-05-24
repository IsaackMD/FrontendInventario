import api, { toArrayResponse } from "./api";

const PRODUCTS_ENDPOINT = "/Products";
const CATEGORIES_ENDPOINT = "/Categories";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toOptionalText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function mapProduct(product) {
  return {
    id: product.id,
    name: product.name ?? "",
    description: product.description ?? "",
    sku: product.sku ?? "",
    stock: toNumber(product.stock),
    stockMin: toNumber(product.stockmin ?? product.stockMin),
    price: toNumber(product.price),
    categoryId: product.categoryId ?? "",
    categoryName: product.categoryName ?? "",
  };
}

export function mapCategory(category) {
  return {
    id: category.id,
    name: category.name ?? "",
    description: category.description ?? "",
    isActive: category.isDelete === undefined ? true : !category.isDelete,
    productCount: toNumber(
      category.productCount ??
        category.productsCount ??
        category.totalProducts ??
        category.totalProducto,
    ),
    createdAt: category.createdAt ?? category.creationDate ?? null,
  };
}

export function buildProductPayload(formData) {
  return {
    Name: toOptionalText(formData.name),
    Description: toOptionalText(formData.description),
    Stock: toNumber(formData.stock),
    Stockmin: toNumber(formData.stockMin),
    price: toNumber(formData.price),
    CategoryId: toOptionalText(formData.categoryId) || null,
  };
}

export function buildCategoryPayload(formData) {
  return {
    Name: toOptionalText(formData.name),
    Description: toOptionalText(formData.description),
  };
}

export async function fetchProducts() {
  const response = await api.get(PRODUCTS_ENDPOINT);
  return toArrayResponse(response).map(mapProduct);
}

export async function createProductRequest(formData) {
  return api.post(PRODUCTS_ENDPOINT, buildProductPayload(formData));
}

export async function updateProductRequest(productId, formData) {
  return api.put(PRODUCTS_ENDPOINT, {
    ...buildProductPayload(formData),
    Id: productId,
  });
}

export async function deleteProductRequest(productId) {
  return api.delete(`${PRODUCTS_ENDPOINT}/${productId}`);
}

export async function fetchCategories() {
  const response = await api.get(CATEGORIES_ENDPOINT);
  return toArrayResponse(response).map(mapCategory);
}

export async function createCategoryRequest(formData) {
  return api.post(CATEGORIES_ENDPOINT, buildCategoryPayload(formData));
}

export async function updateCategoryRequest(categoryId, formData) {
  const payload = { ...buildCategoryPayload(formData), Id: categoryId };
  return api.put(CATEGORIES_ENDPOINT, payload);
}

export async function deleteCategoryRequest(categoryId) {
  return api.deleteWithBody(`${CATEGORIES_ENDPOINT}/status`, {
    id: categoryId,
    isDelete: true,
  });
}
