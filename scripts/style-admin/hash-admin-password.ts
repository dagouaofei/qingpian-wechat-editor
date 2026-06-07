import { hashAdminPassword } from "../../src/server/style-admin/auth/admin-password";

function main() {
  const password = process.argv[2];
  if (!password) {
    console.error("Usage: corepack pnpm style-admin:hash-password \"your-password\"");
    process.exit(1);
  }

  const hash = hashAdminPassword(password);
  console.log(hash);
}

main();
