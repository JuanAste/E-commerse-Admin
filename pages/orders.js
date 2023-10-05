import ButtonSearchIcon from "@/components/ButtonSearchIcon";
import Layout from "@/components/Layout";
import Paginate from "@/components/Paginate";
import Spinner from "@/components/Spinner";
import OrderFilter from "@/components/order/OrderFilter";
import OrderTable from "@/components/order/OrderTable";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [disabledButton, setDisabledButton] = useState(false);
  const [paid, setPaid] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // search
  const [searchEmail, setSearchEmail] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/orders`, {
        params: { page, paid, status, searchEmail },
      })
      .then((response) => {
        setOrders(response.data);
        setDisabledButton(false);
        setLoading(false);
      });
  }, [page, paid, status, searchEmail]);


  function onClickSearch() {
    setSearchEmail(searchValue);
  }

  return (
    <Layout>
      <h1>Orders</h1>

      <OrderFilter
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setPaid={setPaid}
        setStatus={setStatus}
        onClickSearch={onClickSearch}
      />

      <OrderTable orders={orders} setOrders={setOrders} loading={loading} />

      <div>
        {loading ? (
          <div className=" mt-20 mb-20 flex justify-center items-center md:mt-28 md:mb-48">
            <Spinner size={100} />
          </div>
        ) : null}
      </div>

      <div>
        {!orders?.length && !loading && (
          <h1 className=" text-center mt-4">No results found</h1>
        )}
      </div>

      <Paginate
        page={page}
        setPage={setPage}
        disabledButton={disabledButton}
        setDisabledButton={setDisabledButton}
        params={orders}
        amount={10}
      />
    </Layout>
  );
}
