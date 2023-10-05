import axios from "axios";

export default   async function enableProduct(product, setProducts) {
    setProducts((prev) => {
      const update = prev.map((prod) => {
        if (prod._id === product._id) {
          return { ...prod, enabled: !product.enabled };
        } else {
          return prod;
        }
      });
      return update;
    });
    const data = { _id: product._id, enabled: !product.enabled };
    await axios.put("/api/products", data).catch((error) => console.log(error));
  }