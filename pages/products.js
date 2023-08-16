import Layout from "@/components/Layout";
import Paginate from "@/components/Paginate";
import PropertiesProduct from "@/components/PropertiesProdutc";
import handleProductProp from "@/functions/handleProductProp";
import propertiesToFillFunc from "@/functions/propertiesToFillFunc";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [disabledButton, setDisabledButton] = useState(false);

  //filters
  const [searchTitle, setSearchTitle] = useState("");
  const [category, setCategory] = useState("");
  const [properties, setProperties] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getServerProducts();
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, [page, category, properties, stock, status]);

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
        if (!response.data.length) {
          setPage(page > 1 ? page - 1 : page);
          setDisabledButton(false);
          setProducts(response.data);
        } else {
          setProducts(response.data);
          setDisabledButton(false);
        }
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
          <div className=" flex mt-4 justify-center">
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
              className=" h-10  w-96"
            />
            <div>
              <button
                onClick={() => getServerProducts()}
                className="btn-default h-10 "
              >
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className=" text-center flex gap-5 flex-wrap ">
            <div className=" w-96">
              <label>Category</label>
              <select
                value={category}
                onChange={(ev) => {
                  setCategory(ev.target.value);
                  if (!ev.target.value) {
                    setProperties("");
                  }
                }}
                className=" text-center"
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
            <div>
              <label>Stock</label>
              <select
                onChange={(ev) => {
                  setStock(ev.target.value);
                }}
              >
                <option value="">All</option>
                <option value="withStock">With stock</option>
                <option value="noStock">No stock</option>
              </select>
            </div>
            <div>
              <label>Status</label>
              <select
                onChange={(ev) => {
                  setStatus(ev.target.value);
                }}
              >
                <option value="">All</option>
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>
            {propertiesToFill.length > 0 && (
              <PropertiesProduct
                propertiesToFill={propertiesToFill}
                properties={properties}
                setProperties={setProperties}
                classname={"flex text-center gap-5"}
              />
            )}
          </div>
        </div>
      </div>

      <div style={{ minHeight: "530px" }}>
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Product name</td>
              <td>Stock</td>
              <td>status</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.title}</td>
                <td>{product.stock || 0}</td>
                <td>
                  <button
                    className={
                      (product.enabled ? "btn-green" : "btn-red") + " mb-1"
                    }
                    onClick={() => enableProduct(product)}
                  >
                    {product.enabled ? "enable" : "disable"}
                  </button>
                </td>
                <td>
                  <Link
                    className="btn-primary mb-1"
                    href={"/products/edit/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    className="btn-red"
                    href={"/products/delete/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
