import { Fragment } from "react/jsx-runtime";
import { useProduct, useProducts } from "../services/queries";
import { useState } from "react";
import type { Product } from "../types/Product";

const Products = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const productsQuery = useProducts();
  const productQuery = useProduct(selectedProductId)
  return (
    <div style={{ marginTop: "20px" }}>
      <h1>Products</h1>
      <div>
        {productsQuery.data?.pages.map((group, index) => (
          <Fragment key={index}>
            {group.map((product: Product) => (
              <Fragment key={product.id}>
                <button onClick={() => setSelectedProductId(product.id)}>
                  {product.name}
                </button>
                <br />
              </Fragment>
            ))}
          </Fragment>
        ))}
        <br />
        <div>
          <button
            onClick={() => productsQuery.fetchNextPage()}
            disabled={
              !productsQuery.hasNextPage || productsQuery.isFetchingNextPage
            }
          >
            {productsQuery.isFetchingNextPage
              ? "Loading more ..."
              : productsQuery.hasNextPage
                ? "Load more"
                : "No more products"}
          </button>
        </div>
        <div>Selected product: {JSON.stringify(productQuery.data)}</div>
      </div>
    </div>
  );
};

export default Products;
