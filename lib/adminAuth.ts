import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

export const SUPER_ADMIN_EMAILS = ["berglin1998@gmail.com"];

export type AdminPermission =
  | "ORDERS_MANAGE"
  | "USERS_MANAGE"
  | "INVITATIONS_MANAGE"
  | "CANVA_TEMPLATES_MANAGE"
  | "SHOP_PRODUCTS_MANAGE"
  | "ADMINS_MANAGE";

export const ALL_ADMIN_PERMISSIONS: { key: AdminPermission; label: string; description: string }[] = [
  {
    key: "ORDERS_MANAGE",
    label: "Orders & Print Fulfillment",
    description: "Manage physical card orders, print status, shipping, customer chat, and work order PDFs.",
  },
  {
    key: "USERS_MANAGE",
    label: "Users & Quota Allocation",
    description: "View registered users, grant template & card credits, and manage user subscriptions.",
  },
  {
    key: "INVITATIONS_MANAGE",
    label: "Invitations & Lock Security",
    description: "Inspect customer digital invitations, view RSVP guests, and lock/unlock public links.",
  },
  {
    key: "CANVA_TEMPLATES_MANAGE",
    label: "Canva Template Studio",
    description: "Create, edit, and publish dynamic Canva card templates and decorative motif assets.",
  },
  {
    key: "SHOP_PRODUCTS_MANAGE",
    label: "Print Shop Catalog",
    description: "Manage physical print products, paper stocks, wax seals, and pricing tiers.",
  },
  {
    key: "ADMINS_MANAGE",
    label: "Staff & Permissions (Super Admin)",
    description: "Create new sub-admins, promote existing users to admin, and manage staff permissions.",
  },
];

export interface AuthenticatedAdmin {
  id: string;
  name: string | null;
  email: string;
  role: string; // SUPER_ADMIN, ADMIN, SUB_ADMIN, USER
  adminPermissions: string[];
  isSuperAdmin: boolean;
}

export async function getAdminAuth(requiredPermission?: AdminPermission): Promise<{
  error?: string;
  status?: number;
  admin?: AuthenticatedAdmin;
}> {
  await ensureDbSchema();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return { error: "Unauthorized. Please sign in.", status: 401 };
  }

  const currentUserEmail = session.user.email.toLowerCase().trim();
  const isSuperAdminEmail = SUPER_ADMIN_EMAILS.includes(currentUserEmail);

  let dbUser: any = null;
  try {
    dbUser = await (prisma as any).user.findUnique({
      where: { email: currentUserEmail },
      select: { id: true, name: true, email: true, role: true, adminPermissions: true },
    });
  } catch (e: any) {
    console.warn("Error finding admin user via prisma, attempting fallback:", e?.message);
    try {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id", "name", "email", "role", "adminPermissions" FROM "User" WHERE LOWER("email") = $1 LIMIT 1`,
        currentUserEmail
      );
      if (rows && rows.length > 0) dbUser = rows[0];
    } catch (sqlErr: any) {
      console.error("SQL query error in getAdminAuth:", sqlErr?.message);
    }
  }

  if (!dbUser) {
    return { error: "User account not found.", status: 404 };
  }

  const role = isSuperAdminEmail ? "SUPER_ADMIN" : (dbUser.role || "USER").toUpperCase();
  const isSuperAdmin = isSuperAdminEmail || role === "SUPER_ADMIN";

  // If user is regular USER and not Super Admin email
  if (!isSuperAdmin && role !== "ADMIN" && role !== "SUB_ADMIN") {
    return { error: "Forbidden. Admin privileges required.", status: 403 };
  }

  let permissions: string[] = [];
  if (Array.isArray(dbUser.adminPermissions)) {
    permissions = dbUser.adminPermissions;
  } else if (typeof dbUser.adminPermissions === "string") {
    try {
      permissions = JSON.parse(dbUser.adminPermissions);
    } catch {
      permissions = [];
    }
  }

  // Legacy ADMIN role with empty permissions gets all regular permissions by default
  if (!isSuperAdmin && role === "ADMIN" && permissions.length === 0) {
    permissions = [
      "ORDERS_MANAGE",
      "USERS_MANAGE",
      "INVITATIONS_MANAGE",
      "CANVA_TEMPLATES_MANAGE",
      "SHOP_PRODUCTS_MANAGE",
    ];
  }

  // Super Admins have all permissions including ADMINS_MANAGE
  if (isSuperAdmin) {
    permissions = ALL_ADMIN_PERMISSIONS.map((p) => p.key);
  }

  // Check required permission if provided
  if (requiredPermission && !isSuperAdmin) {
    // Only Super Admin can manage other admins
    if (requiredPermission === "ADMINS_MANAGE") {
      return { error: "Forbidden. Only Super Admin can manage administrative staff.", status: 403 };
    }

    if (!permissions.includes(requiredPermission)) {
      return {
        error: `Forbidden. You lack the required '${requiredPermission}' administrative permission.`,
        status: 403,
      };
    }
  }

  return {
    admin: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role,
      adminPermissions: permissions,
      isSuperAdmin,
    },
  };
}
