import Link from "next/link";
import DisableIcon from "../icons/DisableIcon";
import EnableIcon from "../icons/EnableIcon";

export default function OrderTable({ orders, statusClick, loading }) {
  return (
    <table className="basic mt-2">
      <thead>
        <tr>
          <th className=" hidden md:table-cell">Date</th>
          <th>Paid</th>
          <th>Recipient</th>
          <th className=" hidden md:table-cell">Products</th>
          <th>Status</th>
        </tr>
      </thead>
      {!loading && (
        <tbody>
          {!!orders.length &&
            orders.map((order) => (
              <tr key={order._id}>
                <td className=" hidden md:table-cell ">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td
                  className={
                    (order.paid ? "text-green-600" : "text-red-600") +
                    " text-xs md:text-base"
                  }
                >
                  {order.paid ? "YES" : "NO"}
                </td>
                <td className="text-xs md:text-base">
                  {order.name},<br />
                  {order.email}, <br />
                  postal code: {order.postalCode}
                </td>
                <td className="text-xs hidden md:text-base md:table-cell ">
                  {order.line_items?.slice(0, 2).map((l, index) => (
                    <div key={index}>
                      {l.price_data?.product_data?.name} x {l.quantity}
                      {index === 1 && <span>...</span>}
                      <br />
                    </div>
                  ))}
                </td>
                <td className=" md:flex md:items-center md:justify-center md:mt-5">
                  <div>
                    <button
                      className={
                        (order.delivered ? "btn-green " : "btn-red") +
                        " mb-1 md:w-36"
                      }
                      onClick={() => {
                        statusClick(order);
                      }}
                    >
                      {order.delivered ? (
                        <div className=" flex items-center justify-center">
                          <EnableIcon />
                          <span className="hidden md:flex md:ml-2">
                            Delivered
                          </span>
                        </div>
                      ) : (
                        <div className=" flex items-center justify-center">
                          <DisableIcon />
                          <span className="hidden md:flex md:ml-2">
                            Undelivered
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                  <div>
                    <Link
                      className="btn-primary mb-1"
                      href={"/order/" + order._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                      <span className="hidden md:flex md:ml-1 md:w-18 p-0.5 items-center justify-cente ">
                        More info
                      </span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      )}
    </table>
  );
}
