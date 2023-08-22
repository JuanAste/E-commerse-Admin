import ButtonSearchIcon from "@/components/ButtonSearchIcon";
import Layout from "@/components/Layout";
import Paginate from "@/components/Paginate";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [disabledButton, setDisabledButton] = useState(false);
  const [paid, setPaid] = useState("");
  const [status, setStatus] = useState("");

  // search
  const [searchEmail, setSearchEmail] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios
      .get(`/api/orders`, {
        params: { page, paid, status, searchEmail },
      })
      .then((response) => {
        setOrders(response.data);
        setDisabledButton(false);
      });
  }, [page, paid, status, searchEmail]);

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

  function onClickSearch() {
    setSearchEmail(searchValue);
  }

  return (
    <Layout>
      <h1>Orders</h1>
      <div className="flex mt-4 justify-center">
        <input
          type="text"
          className=" w-1/2"
          placeholder="Search email user"
          value={searchValue}
          onChange={(ev) => setSearchValue(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              onClickSearch();
            }
          }}
        />
        <div>
          <ButtonSearchIcon functionEjec={onClickSearch} />
        </div>
      </div>
      <div className="flex justify-center gap-5">
        <div className=" w-1/3 text-center">
          <label>Paid</label>
          <select
            onChange={(ev) => setPaid(ev.target.value)}
            className="select-def"
          >
            <option value="">All</option>
            <option value="yes">Paid</option>
            <option value="no">Unpaid</option>
          </select>
        </div>
        <div className=" w-1/3 text-center">
          <label>Status</label>
          <select
            onChange={(ev) => setStatus(ev.target.value)}
            className="select-def"
          >
            <option value="">All</option>
            <option value="yes">Delivered</option>
            <option value="no">Undelivered</option>
          </select>
        </div>
      </div>
      <table className="basic mt-2">
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
                    className={
                      (order.delivered ? "btn-green w-28" : "btn-red") + " mb-1"
                    }
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
      <div>{!orders?.length && <h1 className=" text-center mt-4" >No hay mas ordenes</h1>}</div>
      <div>
        <Paginate
          page={page}
          setPage={setPage}
          disabledButton={disabledButton}
          setDisabledButton={setDisabledButton}
          params={orders}
          amount={10}
        />
      </div>
    </Layout>
  );
}
