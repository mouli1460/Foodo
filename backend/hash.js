// hash.js
import bcrypt from "bcrypt";

const hashPassword = async () => {
  const salt = await bcrypt.genSalt(10); // Or use Number(process.env.SALT)
  const hashed = await bcrypt.hash("Admin@1234", salt);
  console.log("Hashed Password:", hashed);
};

hashPassword();
