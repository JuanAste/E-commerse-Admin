import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { ReactSortable } from "react-sortablejs";
import propertiesToFillFunc from "@/functions/propertiesToFillFunc";
import PropertiesProduct from "./PropertiesProdutc";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
  stock: existingStock,
  enabled: existingEnabled,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || null);
  const [category, setCategory] = useState(existingCategory || "");
  const [images, setImages] = useState(existingImages || []);
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const [stock, setStock] = useState(existingStock || null);
  const [enabled, setEnabled] = useState(existingEnabled || false);
  const [isUpload, setIsUpload] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
      stock,
      enabled,
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUpload(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post(`/api/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUpload(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  const propertiesToFill = propertiesToFillFunc(categories, category);

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option>Uncategorized</option>
        {categories.length &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 && (
        <PropertiesProduct
          propertiesToFill={propertiesToFill}
          properties={productProperties}
          setProperties={setProductProperties}
        />
      )}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link, index) => {
              return (
                <div
                  key={index}
                  className="h-24 bg-gray-200 p-1 shadow-sm rounded-sm border border-gray-300"
                >
                  <img src={link} alt="" className="rounded-lg" />
                </div>
              );
            })}
        </ReactSortable>
        {isUpload && (
          <div className="h-24 flex items-center">
            <Spinner size={60} />
          </div>
        )}
        <label
          className="w-24 h-24 bg-white cursor-pointer flex flex-col
         text-center items-center justify-center
          text-sm gap-1 text-primary rounded-sm shadow-sm border border-primary"
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <label>Stock</label>
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(ev) => setStock(ev.target.value)}
      />
      <label className="block">Product status</label>
      <button
        onClick={() => setEnabled(!enabled)}
        className={(enabled ? "btn-green" : "btn-red") + " block mb-2"}
        type="button"
      >
        {enabled ? "Enabled" : "disabled"}
      </button>
      <button
        type="button"
        onClick={() => {
          router.push("/products");
        }}
        className="btn-default mr-1"
      >
        Cancel
      </button>
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
