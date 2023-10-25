import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import OrderTable from "@/components/order/OrderTable";
import ProductTable from "@/components/product/ProductTable";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrd, setLoadingOrd] = useState(true);

  useEffect(() => {
    if (session) {
      axios
        .get("/api/products?stock=StockUp")
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
      axios
        .get("/api/orders?paid=si")
        .then((res) => {
          setOrders(res.data);
          setLoadingOrd(false);
        })
        .catch((err) => console.log(err));
    }
  }, [session]);

  const newProd = products?.slice(0, 5);
  const newOrd = orders?.slice(0, 4);

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between mb-4">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden ">
          <img src={session?.user?.image} alt="" className="w-6 h-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
      <div className=" mb-6 text-center">
        <div>
          <h1>Latest orders (paid)</h1>
        </div>
        <OrderTable
          orders={newOrd}
          setOrders={setOrders}
          loading={loadingOrd}
        />
        <div>
          {loadingOrd ? (
            <div className=" mt-20 mb-20 flex justify-center items-center md:mt-28 md:mb-48">
              <Spinner size={100} />
            </div>
          ) : null}
        </div>

        <div>
          {!newOrd?.length && !loadingOrd && (
            <h1 className=" text-center mt-4">No results found</h1>
          )}
        </div>
      </div>
      <div>
        <div className=" text-center">
          <h1>Products with less stock</h1>
        </div>
        <ProductTable
          setProducts={setProducts}
          products={newProd}
          loading={loading}
        />
        <div>
          {loading ? (
            <div className=" flex justify-center items-center mt-48">
              <Spinner size={100} />
            </div>
          ) : null}
        </div>

        <div>
          {!newProd?.length && !loading && (
            <h1 className=" text-center mt-4">No results found</h1>
          )}
        </div>
      </div>
    </Layout>
  );
}
