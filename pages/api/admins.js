import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Admin.findOne({ _id: req.query?.id }));
    } else {
      res.json(await Admin.find());
    }
  }
  if (method === "POST") {
    const { email } = req.body;
    const adminDoc = await Admin.create({
      email,
    });
    res.json(adminDoc);
  }
  if (method === "DELETE") {
    if (req.query?._id) {
      await Admin.deleteOne({ _id: req.query?._id });
      res.json(true);
    }
  }
}
