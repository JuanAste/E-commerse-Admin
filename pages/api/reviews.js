import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    const { page, _id } = req.query;
    const pageNumber = page || 1;
    const skipCount = (pageNumber - 1) * 12;

    const rev = await Review.find({ ProductId: _id }).skip(skipCount).limit(12);
    res.json(rev);
  }
  if (method === "DELETE") {
    const { _id } = req.query;
    await Review.deleteOne({ _id });
    res.json(true);
  }
}
