import Link from "next/link";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import EnableIcon from "../icons/EnableIcon";
import DisableIcon from "../icons/DisableIcon";
import enableProduct from "@/functions/enableProduct";

export default function ProductTable({ products, loading, setProducts }) {
  return (
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
                <label className="md:hidden"> - X{product.stock || 0}</label>
              </td>
              <td className=" hidden md:table-cell mt-2">
                {product.stock || 0}
              </td>
              <td>
                <button
                  className={
                    (product.enabled ? "btn-green" : "btn-red") + " mb-1 md:w-28"
                  }
                  onClick={() => enableProduct(product, setProducts)}
                >
                  {product.enabled ? (
                    <div className="flex items-center">
                     <EnableIcon />
                      <span className="hidden md:flex ml-2">Enable</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                     <DisableIcon />
                      <span className="hidden md:flex ml-2">Disable</span>
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
  );
}
