import clientPromise from "@/lib/mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

async function getAdmin(email) {
  await mongooseConnect();
  const adminEmail = await Admin.findOne({ email });
  return adminEmail;
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token, user }) {
      const userAdmin = await getAdmin(session?.user?.email);
      if (userAdmin) {
        return session;
      } else {
        return {notAdmin:true};
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const user = await getAdmin(session?.user?.email);
  if (!user) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
