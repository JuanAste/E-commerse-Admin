import Layout from "@/components/Layout";
import Paginate from "@/components/Paginate";
import PropertiesProduct from "@/components/product/PropertiesProdutc";
import Spinner from "@/components/Spinner";
import propertiesToFillFunc from "@/functions/propertiesToFillFunc";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductTable from "@/components/product/ProductTable";
import ProductFilter from "@/components/product/ProductFilter";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [disabledButton, setDisabledButton] = useState(false);
  const [loading, setLoading] = useState(true);

  //filters
  const [searchTitle, setSearchTitle] = useState("");
  const [category, setCategory] = useState("");
  const [properties, setProperties] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getServerProducts();
  }, [page, category, properties, stock, status]);

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  function getServerProducts() {
    setLoading(true);
    let data = `?page=${page}`;

    if (searchTitle) {
      data += `&&title=${searchTitle}`;
    }
    if (category) {
      data += `&&category=${category}`;
    }
    if (properties && category) {
      let i = 0;
      for (const key in properties) {
        data += `&&name${i}=${key}&&value${i}=${properties[key]}`;
        i++;
      }
    }
    if (stock) {
      data += `&&stock=${stock}`;
    }

    if (status) {
      data += `&&status=${status}`;
    }

    axios
      .get("/api/products" + data)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
        setDisabledButton(false);
      })
      .catch((error) => console.log(error));
  }

  async function enableProduct(product) {
    setProducts((prev) => {
      const update = prev.map((prod) => {
        if (prod._id === product._id) {
          return { ...prod, enabled: !product.enabled };
        } else {
          return prod;
        }
      });
      return update;
    });
    const data = { _id: product._id, enabled: !product.enabled };
    await axios.put("/api/products", data).catch((error) => console.log(error));
  }

  const propertiesToFill = propertiesToFillFunc(categories, category);

  return (
    <Layout>
      <Link href={"/products/new"} className="btn-primary">
        Add new product
      </Link>
      <div>
        <ProductFilter
          getServerProducts={getServerProducts}
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
          categories={categories}
          category={category}
          setCategory={setCategory}
          setProperties={setProperties}
          setStock={setStock}
          setStatus={setStatus}
        />
      </div>
      <div>
        <div style={{ minHeight: "80px" }}>
          {propertiesToFill.length > 0 && (
            <PropertiesProduct
              propertiesToFill={propertiesToFill}
              properties={properties}
              setProperties={setProperties}
              classname={"flex text-center gap-5 w-1/4"}
            />
          )}
        </div>
      </div>

      <div style={{ minHeight: "565px" }}>
        <ProductTable
          enableProduct={enableProduct}
          products={products}
          loading={loading}
        />

        <div>
          {loading ? (
            <div className=" flex justify-center items-center mt-48">
              <Spinner size={100} />
            </div>
          ) : null}
        </div>

        <div>
          {!products?.length && !loading && (
            <h1 className=" text-center mt-4">No results found</h1>
          )}
        </div>
      </div>

      <Paginate
        page={page}
        setPage={setPage}
        disabledButton={disabledButton}
        setDisabledButton={setDisabledButton}
        params={products}
        amount={12}
      />
    </Layout>
  );
}
