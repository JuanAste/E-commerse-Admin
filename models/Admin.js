const { Schema, model, models } = require("mongoose");

const AdminSchema = new Schema({
  email: String,
});

export const Admin = models.Admin || model("Admin", AdminSchema);
