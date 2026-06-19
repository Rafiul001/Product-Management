/**
 * Creates (or reports an existing) SUPER_ADMIN account.
 *
 * Credentials are resolved in this order per field:
 *   1. CLI flag      --username <v>  --email <v>  --password <v>
 *   2. Environment   SUPER_ADMIN_USERNAME / SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD
 *   3. Interactive prompt (password input is masked)
 *
 * Run with:
 *   npm run create:super-admin
 *   npm run create:super-admin -- --username root --email root@site.com
 *   SUPER_ADMIN_USERNAME=root SUPER_ADMIN_EMAIL=root@site.com SUPER_ADMIN_PASSWORD=secret npm run create:super-admin
 *
 * The script is idempotent: it refuses to create a duplicate username and warns
 * if a SUPER_ADMIN already exists.
 */
import { dbConnect, dbDisconnect } from "@server/dbConnection/dbConnection.js";
import { ADMIN_TYPES, AdminModel } from "@shared/models/Admin.js";
import { hashPassowrd } from "@shared/utils/passwordEncrypter.js";
import readline from "node:readline";

const parseFlag = (name: string): string | undefined => {
  const index = process.argv.indexOf(`--${name}`);
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return undefined;
};

const prompt = (question: string, mask = false): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (mask) {
      // Hide characters as they are typed for password input.
      const rlAny = rl as unknown as {
        output: NodeJS.WriteStream;
        _writeToOutput: (s: string) => void;
      };
      rlAny._writeToOutput = (stringToWrite: string) => {
        if (stringToWrite.includes(question)) {
          rlAny.output.write(stringToWrite);
        } else {
          rlAny.output.write("*");
        }
      };
    }

    rl.question(question, (answer) => {
      rl.close();
      if (mask) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
};

const resolveValue = async (
  flag: string,
  envKey: string,
  label: string,
  mask = false,
): Promise<string> => {
  const value = parseFlag(flag) ?? process.env[envKey];
  if (value) return value.trim();
  return prompt(`${label}: `, mask);
};

const main = async () => {
  const adminUserName = await resolveValue(
    "username",
    "SUPER_ADMIN_USERNAME",
    "Super admin username",
  );
  const adminEmail = await resolveValue(
    "email",
    "SUPER_ADMIN_EMAIL",
    "Super admin email",
  );
  const password = await resolveValue(
    "password",
    "SUPER_ADMIN_PASSWORD",
    "Super admin password",
    true,
  );

  if (!adminUserName || !adminEmail || !password) {
    throw new Error("username, email and password are all required.");
  }

  await dbConnect();
  console.log("Connected to the database.");

  try {
    const existingByName = await AdminModel.findOne({ adminUserName }).lean();
    if (existingByName) {
      console.error(
        `An admin with username "${adminUserName}" already exists. Aborting.`,
      );
      process.exitCode = 1;
      return;
    }

    const existingSuperAdmin = await AdminModel.findOne({
      adminType: ADMIN_TYPES.SUPER_ADMIN,
    }).lean();
    if (existingSuperAdmin) {
      console.warn(
        `Warning: a SUPER_ADMIN already exists ("${existingSuperAdmin.adminUserName}"). Creating another one.`,
      );
    }

    const hashedPassword = await hashPassowrd(password);

    const admin = await AdminModel.create({
      adminUserName,
      adminEmail,
      password: hashedPassword,
      adminType: ADMIN_TYPES.SUPER_ADMIN,
    });

    console.log(
      `Super admin created: ${admin.adminUserName} <${admin.adminEmail}> (id: ${admin._id.toString()})`,
    );
  } finally {
    await dbDisconnect();
    console.log("Database connection closed.");
  }
};

main().catch((error) => {
  console.error("Failed to create super admin:", error);
  process.exit(1);
});
