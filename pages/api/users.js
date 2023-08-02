import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { User } from "@/models/User";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await User.findOne({ _id: req.query?.id }));
    } else {
      const { email, page } = req.query;
      const pageNumber = page || 1;
      const skipCount = (pageNumber - 1) * 12;
      const findUser = {};
      if (email) {
        findUser.email = {
          $regex: new RegExp(email, "i"),
        };
      }

      const users = await User.find(findUser).skip(skipCount).limit(12);

      res.json(users);
    }
  }
  if (method === "PUT") {
    const { ban, _id } = req.body;
    await User.updateOne(
      { _id },
      {
        ban,
      }
    );
    res.json(true);
  }
}
