import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OrderPage(){
    const [order, setOrder] = useState(null)
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
      console.log(order);

      return(
        <div>
          <Layout>
              <h1>Order</h1>

              
          </Layout>
        </div>
      )
}