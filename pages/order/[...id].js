import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import imageErr404 from "../../Images/error 404.png";
import Link from "next/link";
import EnableIcon from "@/components/icons/EnableIcon";
import DisableIcon from "@/components/icons/DisableIcon";

export default function OrderPage() {
  const [order, setOrder] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/orders?id=" + id).then((response) => {
      setOrder(response.data);
    });
  }, [id]);

  async function statusClick() {
    const data = { status: !order.delivered, _id: order._id };

    setOrder((prev) => {
      return { ...prev, delivered: !order.delivered };
    });

    await axios.put("/api/orders", data);
  }

  return (
    <div>
      <Layout>
        <h1>Order</h1>

        <div>
          <h2 className=" text-blue-600">Products</h2>
          <div className=" bg-gray-200  flex flex-wrap gap-10 m-4 p-5 justify-center rounded-md shadow-md ">
            {order?.line_items?.map((product, index) => {
              const productProps = product?.price_data?.product_data;
              return (
                <Link
                  href={"/products/edit/" + productProps?._id}
                  key={index}
                  className=" flex flex-col items-center"
                >
                  <div className=" h-24 p-1 rounded-sm border max-w-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productProps?.image || imageErr404.src}
                      alt=""
                      className="rounded-lg"
                    />
                  </div>
                  <h4>
                    {productProps?.name.length > 15
                      ? productProps?.name.slice(0, 15) + "..."
                      : productProps?.name}
                  </h4>
                  <h4 className=" font-semibold">
                    {productProps?.price || "$"}
                  </h4>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-10">
          <h2 className=" text-blue-600">User Details</h2>
          {!!order && (
            <div className="flex justify-center mt-2">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:max-w-3xl text-center">
                <div className="userDetail">
                  <div className="">
                    <h3>Name:</h3>
                    <h4>{order.name}</h4>
                  </div>
                  <div>
                    <h3>Email:</h3>
                    <h4>{order.email}</h4>
                  </div>
                  <div>
                    <h3>paid:</h3>
                    <h4>{order.paid ? "Yes" : "No"}</h4>
                  </div>
                </div>

                <div className="userDetail">
                  <h3>country:</h3>
                  <h4>{order.country}</h4>
                  <h3>city:</h3>
                  <h4>{order.city}</h4>
                  <h3>Street address:</h3>
                  <h4>{order.streetAddress}</h4>
                  <h3>postalCode:</h3>
                  <h4>{order.postalCode}</h4>
                </div>
              </div>
            </div>
          )}
        </div>

        {!!order && (
          <div className=" flex justify-center">
            <button
              className={
                (order.delivered ? "btn-green " : "btn-red ") + " mb-1 md:w-52"
              }
              onClick={() => {
                statusClick();
              }}
            >
              {order.delivered ? (
                <div className=" flex items-center justify-center">
                  <EnableIcon />
                  <span className="md:ml-2">Delivered</span>
                </div>
              ) : (
                <div className=" flex items-center justify-center">
                  <DisableIcon />
                  <span className=" md:ml-2">Undelivered</span>
                </div>
              )}
            </button>
          </div>
        )}
      </Layout>
    </div>
  );
}
