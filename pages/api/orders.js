import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Order.findOne({ _id: req.query?.id }));
    } else {
      res.json(await Order.find().sort({ createdAt: -1 }));
    }
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
