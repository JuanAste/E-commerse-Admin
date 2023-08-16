import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  async function statusClick(order) {
    const data = { status: !order.delivered, _id: order._id };
    setOrders((prev) => {
      const update = prev.map((prod) => {
        if (prod._id === order._id) {
          return { ...prod, delivered: !order.delivered };
        } else {
          return prod;
        }
      });
      return update;
    });
    await axios.put("/api/orders", data);
  }

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Postal code</th>
            <th>Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {!!orders.length &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} {order.email} <br />
                  {order.city} {order.country} <br />
                  {order.streetAddress}
                </td>
                <td>{order.postalCode}</td>
                <td>
                  {order.line_items?.map((l) => (
                    <>
                      {l.price_data?.product_data?.name} x {l.quantity} <br />
                      <br />
                    </>
                  ))}
                </td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      statusClick(order);
                    }}
                  >
                    {order.delivered ? "Delivered" : "Undelivered"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
