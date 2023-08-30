import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";

export default function CategoriesTable({
  categories,
  editCategory,
  deleteCategory,
}) {
  return (
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
              <td className="md:flex md:gap-5 justify-center">
                <button
                  className="btn-primary flex items-center mb-1"
                  onClick={() => editCategory(category)}
                >
                  <EditIcon />
                  <label className="hidden md:flex ml-2"> Edit</label>
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
  );
}
