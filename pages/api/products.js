import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query?.id }));
    } else {
      const { page, title, category, stock, status } = req.query;
      const pageNumber = page || 1;
      const skipCount = (pageNumber - 1) * 12;

      // Build array of properties
      const propertiesArray = [];
      let i = 0;

      while (req.query[`name${i}`]) {
        const newProp = {
          name: [req.query[`name${i}`]],
          value: req.query[`value${i}`],
        };
        propertiesArray.push(newProp);
        i++;
      }

      const findProducts = {};

      if (title) {
        findProducts.title = {
          $regex: new RegExp(title, "i"),
        };
      }

      if (category) {
        findProducts.category = [category];
        const categorydb = await Category.findById(category);
        if (!categorydb?.parent) {
          const categoriesParent = await Category.find({ parent: category });
          for (const categ of categoriesParent) {
            findProducts.category.push(categ._id);
          }
        }
      }

      // Add properties to the findProducts object
      if (propertiesArray.length) {
        for (const prop of propertiesArray) {
          findProducts[`properties.${prop.name}`] = prop.value;
        }
      }

      if (stock) {
        if (stock === "noStock") {
          findProducts.$or = [
            { stock: { $eq: 0 } },
            { stock: { $exists: false } },
          ];
        } else {
          findProducts.stock = { $gte: 1 };
        }
      }

      if (status) {
        if (status === "disable") {
          findProducts.$or = [
            { enabled: { $eq: false } },
            { enabled: { $exists: false } },
          ];
        } else {
          findProducts.enabled = { $eq: true };
        }
      }

      const products = await Product.find(findProducts)
        .skip(skipCount)
        .limit(12);

      res.json(products);
    }
  }
  if (method === "POST") {
    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      stock,
      enabled,
    } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      stock,
      enabled,
    });
    res.json(productDoc);
  }
  if (method === "PUT") {
    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      stock,
      enabled,
      _id,
    } = req.body;
    await Product.updateOne(
      { _id },
      {
        title,
        description,
        price,
        images,
        category,
        properties,
        stock,
        enabled,
      }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
