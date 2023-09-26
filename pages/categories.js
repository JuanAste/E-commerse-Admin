import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import CategoriesTable from "@/components/categories/categoriesTable";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setLoading(false);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
      image,
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
    setImage("")
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setImage(category.image);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyName(index, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValues(index, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newName;
      return properties;
    });
  }

  function removeProperty(index) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== index;
      });
    });
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
      setImage(res.data.links[0]);
      setIsUpload(false);
    }
  }

  console.log(image);

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value="">No parent category</option>
            {categories?.length &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex gap-2" >
         {!!image && <div className="h-24 bg-gray-200 p-1 shadow-sm rounded-sm border border-gray-300">
          <img className="rounded-lg" alt="" src={image} />
          </div>}
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
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            className="btn-default text-sm mb-2"
            onClick={addProperty}
            type="button"
          >
            Add new property
          </button>
          {!!properties.length &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  placeholder="property name (example: color)"
                  value={property.name}
                  onChange={(ev) => handlePropertyName(index, ev.target.value)}
                />
                <input
                  type="text"
                  className="mb-0"
                  placeholder="values, comma separated"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValues(index, ev.target.value)
                  }
                />
                <button
                  className="btn-red"
                  onClick={() => removeProperty(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button className="btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <div>
          <CategoriesTable
            categories={categories}
            editCategory={editCategory}
            deleteCategory={deleteCategory}
          />
          <div>
            {loading ? (
              <div className=" ml-24 flex items-center mt-20 md:ml-48">
                <Spinner size={100} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
