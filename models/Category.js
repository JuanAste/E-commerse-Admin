const { Schema, models, model, default: mongoose } = require("mongoose");

const CategorySchema = new Schema({
  name: { type: String, require: true },
  image: { type: String },
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: [{ type: Object }],
});

export const Category = models?.Category || model("Category", CategorySchema);
