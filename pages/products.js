import ButtonSearchIcon from "@/components/ButtonSearchIcon";
import Layout from "@/components/Layout";
import Paginate from "@/components/Paginate";
import PropertiesProduct from "@/components/PropertiesProdutc";
import Spinner from "@/components/Spinner";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import propertiesToFillFunc from "@/functions/propertiesToFillFunc";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    setLoading(true);
    getServerProducts();
  }, [page, category, properties, stock, status]);

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  function getServerProducts() {
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
        <div>
          <div className="flex mt-4 justify-center">
            <input
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  getServerProducts();
                }
              }}
              type="text"
              placeholder="Search product name"
              value={searchTitle}
              onChange={(ev) => setSearchTitle(ev.target.value)}
              className=" h-10 w-full md:w-1/5"
            />
            <div>
              <ButtonSearchIcon functionEjec={getServerProducts} />
            </div>
          </div>

          <div className=" text-center flex gap-5 flex-wrap justify-center ">
            <div className="w-full  md:w-1/5">
              <label>Category</label>
              <select
                value={category}
                onChange={(ev) => {
                  setCategory(ev.target.value);
                  if (!ev.target.value) {
                    setProperties("");
                  }
                }}
                className="select-def"
              >
                <option value={""}>Uncategorized</option>
                {categories.length &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className=" w-1/4">
              <label>Stock</label>
              <select
                onChange={(ev) => {
                  setStock(ev.target.value);
                }}
                className="select-def"
              >
                <option value="">All</option>
                <option value="withStock">With stock</option>
                <option value="noStock">No stock</option>
              </select>
            </div>
            <div className=" w-1/4">
              <label>Status</label>
              <select
                onChange={(ev) => {
                  setStatus(ev.target.value);
                }}
                className="select-def"
              >
                <option value="">All</option>
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>
          </div>
        </div>
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
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Product name</td>
              <td className=" hidden md:table-cell">Stock</td>
              <td>status</td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              products?.map((product, index) => (
                <tr key={index}>
                  <td>
                    {product.title}
                    <label className="md:hidden">
                      {" "}
                      - X{product.stock || 0}
                    </label>
                  </td>
                  <td className=" hidden md:table-cell mt-2">{product.stock || 0}</td>
                  <td>
                    <button
                      className={
                        (product.enabled ? "btn-green" : "btn-red") + " mb-1"
                      }
                      onClick={() => enableProduct(product)}
                    >
                      {product.enabled ? (
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="hidden md:flex ml-2"> enable</span>
                        </div>
                      ) : (
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="hidden md:flex ml-2">disable</span>
                        </div>
                      )}
                    </button>
                  </td>
                  <td>
                    <Link
                      className="btn-primary mb-1"
                      href={"/products/edit/" + product._id}
                    >
                      <EditIcon />
                      <span className="hidden md:flex ml-2"> Edit</span>
                    </Link>
                    <Link
                      className="btn-red"
                      href={"/products/delete/" + product._id}
                    >
                      <TrashIcon />
                      <span className="hidden md:flex ml-2"> Delete</span>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

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
