import axios from "axios";

export default async function statusClick(order, setOrders) {
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
