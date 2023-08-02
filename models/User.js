const { Schema, model, models } = require("mongoose");

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    image: String,
    ban: Boolean,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model("User", UserSchema);
