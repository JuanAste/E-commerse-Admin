import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setLoading(false)
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
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
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
        <table className="basic mt-4 md:max-w-lg">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {!!categories?.length &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td className="md:flex md:gap-5 justify-center" >
                    <button
                      className="btn-primary flex items-center mb-1"
                      onClick={() => editCategory(category)}
                    >
                      <EditIcon />
                      <lable className="hidden md:flex ml-2"> Edit</lable>
                    </button>
                    <button
                      className="btn-red flex items-center "
                      onClick={() => deleteCategory(category)}
                    >
                      <TrashIcon />
                      <span className="hidden md:flex ml-2"> Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
