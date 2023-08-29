import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "GET") {
    const { status, paid, searchEmail, page, id } = req.query;
    if(id){
      res.json(await Order.findOne({ _id: id }))
    }else{
    const pageNumber = page || 1;
    const skipCount = (pageNumber - 1) * 10;

    const findOrders = {};

    if (status) {
      if (status === "no") {
        findOrders.$or = [
          { delivered: { $eq: false } },
          { delivered: { $eq: null } },
          { delivered: { $exists: false } },
        ];
      } else {
        findOrders.delivered = true;
      }
    }

    if (paid) {
      if (paid === "no") {
        findOrders.$or = [
          { paid: { $eq: false } },
          { paid: { $eq: null } },
          { paid: { $exists: false } },
        ];
      } else {
        findOrders.paid = true;
      }
    }
    if (searchEmail) {
      findOrders.email = {
        $regex: new RegExp(searchEmail, "i"),
      };
    }

    res.json(
      await Order.find(findOrders)
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(10)
    );}
  }
  if (method === "PUT") {
    const { status, _id } = req.body;
    await Order.updateOne(
      { _id },
      {
        delivered: status,
      }
    );
    res.json(true);
  }
}
