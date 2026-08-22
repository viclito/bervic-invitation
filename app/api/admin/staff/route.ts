import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureDbSchema } from "@/lib/ensureDbSchema";
import { getAdminAuth, SUPER_ADMIN_EMAILS, ALL_ADMIN_PERMISSIONS } from "@/lib/adminAuth";

// GET /api/admin/staff
// - If ?me=true: Returns current admin's role and permission capabilities
// - Otherwise: Returns list of all admin staff + eligible candidates for promotion
export async function GET(req: Request) {
  try {
    await ensureDbSchema();
    const { searchParams } = new URL(req.url);
    const isMeCheck = searchParams.get("me") === "true";

    // 1. If user is only checking their own admin profile
    if (isMeCheck) {
      const auth = await getAdminAuth();
      if (auth.error || !auth.admin) {
        return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
      }
      return NextResponse.json({
        admin: auth.admin,
        allPermissions: ALL_ADMIN_PERMISSIONS,
      });
    }

    // 2. Only Super Admin (ADMINS_MANAGE) can fetch all staff and promotion candidates
    const auth = await getAdminAuth("ADMINS_MANAGE");
    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    // Fetch all users to separate admins and regular user candidates
    let allUsers: any[] = [];
    try {
      allUsers = await (prisma as any).user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          adminPermissions: true,
          createdAt: true,
          plan: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      allUsers = await prisma.$queryRawUnsafe(
        `SELECT "id", "name", "email", "phone", "role", "adminPermissions", "createdAt", "plan" FROM "User" ORDER BY "createdAt" DESC`
      );
    }

    const staffList = (allUsers || [])
      .filter((u) => {
        const emailLower = (u.email || "").toLowerCase().trim();
        const role = (u.role || "").toUpperCase();
        return (
          SUPER_ADMIN_EMAILS.includes(emailLower) ||
          role === "SUPER_ADMIN" ||
          role === "ADMIN" ||
          role === "SUB_ADMIN"
        );
      })
      .map((u) => {
        const emailLower = (u.email || "").toLowerCase().trim();
        const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(emailLower) || u.role === "SUPER_ADMIN";
        let permissions: string[] = [];
        if (Array.isArray(u.adminPermissions)) {
          permissions = u.adminPermissions;
        } else if (typeof u.adminPermissions === "string") {
          try {
            permissions = JSON.parse(u.adminPermissions);
          } catch {
            permissions = [];
          }
        }

        if (isSuperAdmin) {
          permissions = ALL_ADMIN_PERMISSIONS.map((p) => p.key);
        } else if (u.role === "ADMIN" && permissions.length === 0) {
          permissions = [
            "ORDERS_MANAGE",
            "USERS_MANAGE",
            "INVITATIONS_MANAGE",
            "CANVA_TEMPLATES_MANAGE",
            "SHOP_PRODUCTS_MANAGE",
          ];
        }
        return {
          id: u.id,
          name: u.name || "Admin Staff",
          email: u.email,
          phone: u.phone,
          role: isSuperAdmin ? "SUPER_ADMIN" : u.role || "SUB_ADMIN",
          adminPermissions: permissions,
          isSuperAdmin,
          createdAt: u.createdAt,
        };
      });

    // Promotion candidates: regular users
    const candidateUsers = (allUsers || [])
      .filter((u) => {
        const emailLower = (u.email || "").toLowerCase().trim();
        const role = (u.role || "").toUpperCase();
        return (
          !SUPER_ADMIN_EMAILS.includes(emailLower) &&
          role !== "SUPER_ADMIN" &&
          role !== "ADMIN" &&
          role !== "SUB_ADMIN"
        );
      })
      .slice(0, 100) // Top 100 most recent for quick dropdown selection
      .map((u) => ({
        id: u.id,
        name: u.name || "User",
        email: u.email,
        phone: u.phone,
        plan: u.plan,
        createdAt: u.createdAt,
      }));

    return NextResponse.json({
      currentAdmin: auth.admin,
      staff: staffList,
      candidates: candidateUsers,
      allPermissions: ALL_ADMIN_PERMISSIONS,
    });
  } catch (error: any) {
    console.error("GET /api/admin/staff error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch staff" }, { status: 500 });
  }
}

// POST /api/admin/staff -> Create a brand-new sub-admin with credentials & permissions
export async function POST(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("ADMINS_MANAGE");
    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { name, email, password, phone, permissions, role = "SUB_ADMIN" } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Check if user already exists
    let existingUser: any = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id" FROM "User" WHERE LOWER("email") = $1 LIMIT 1`,
        cleanEmail
      );
      if (rows && rows.length > 0) existingUser = rows[0];
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists. Use 'Promote Existing User' instead." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validPermissions = Array.isArray(permissions) ? permissions : [];
    const targetRole = role === "ADMIN" ? "ADMIN" : "SUB_ADMIN";

    let newAdmin: any = null;
    try {
      newAdmin = await (prisma as any).user.create({
        data: {
          name: name ? name.trim() : "Admin Staff",
          email: cleanEmail,
          password: hashedPassword,
          phone: phone ? phone.trim() : null,
          role: targetRole,
          adminPermissions: validPermissions,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          adminPermissions: true,
          createdAt: true,
        },
      });
    } catch (prismaErr: any) {
      console.warn("Prisma create sub-admin failed, using SQL fallback:", prismaErr?.message);
      const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await prisma.$executeRawUnsafe(
        `INSERT INTO "User" ("id", "name", "email", "password", "phone", "role", "adminPermissions", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        newId,
        name ? name.trim() : "Admin Staff",
        cleanEmail,
        hashedPassword,
        phone ? phone.trim() : null,
        targetRole,
        validPermissions
      );
      newAdmin = {
        id: newId,
        name: name ? name.trim() : "Admin Staff",
        email: cleanEmail,
        role: targetRole,
        adminPermissions: validPermissions,
        createdAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      message: `Admin account for ${newAdmin.email} created successfully with ${validPermissions.length} permissions.`,
      admin: newAdmin,
    });
  } catch (error: any) {
    console.error("POST /api/admin/staff error:", error);
    return NextResponse.json({ error: error.message || "Failed to create sub-admin" }, { status: 500 });
  }
}

// PATCH /api/admin/staff -> Promote existing user to Sub-Admin OR update existing admin permissions
export async function PATCH(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("ADMINS_MANAGE");
    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const body = await req.json();
    const { userId, role, permissions, newPassword } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    let targetUser: any = null;
    try {
      targetUser = await (prisma as any).user.findUnique({
        where: { id: userId },
      });
    } catch {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id", "email", "role" FROM "User" WHERE "id" = $1 LIMIT 1`,
        userId
      );
      if (rows && rows.length > 0) targetUser = rows[0];
    }

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const targetEmailLower = (targetUser.email || "").toLowerCase().trim();
    if (SUPER_ADMIN_EMAILS.includes(targetEmailLower)) {
      return NextResponse.json({ error: "Primary Super Admin permissions cannot be modified." }, { status: 400 });
    }

    const updateData: any = {};

    if (role) {
      const validRole = ["USER", "SUB_ADMIN", "ADMIN"].includes(role) ? role : "SUB_ADMIN";
      updateData.role = validRole;
    }

    if (permissions !== undefined) {
      updateData.adminPermissions = Array.isArray(permissions) ? permissions : [];
    }

    if (newPassword && newPassword.trim().length >= 6) {
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    let updatedUser: any = null;
    try {
      updatedUser = await (prisma as any).user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          adminPermissions: true,
          updatedAt: true,
        },
      });
    } catch (prismaUpdateErr: any) {
      console.warn("Prisma user.update failed, using raw SQL fallback:", prismaUpdateErr?.message);
      const setClauses: string[] = [];
      const values: any[] = [];
      let pIdx = 1;

      if (updateData.role !== undefined) {
        setClauses.push(`"role" = $${pIdx++}`);
        values.push(updateData.role);
      }
      if (updateData.adminPermissions !== undefined) {
        setClauses.push(`"adminPermissions" = $${pIdx++}`);
        values.push(updateData.adminPermissions);
      }
      if (updateData.password !== undefined) {
        setClauses.push(`"password" = $${pIdx++}`);
        values.push(updateData.password);
      }
      setClauses.push(`"updatedAt" = NOW()`);
      values.push(userId);

      if (setClauses.length > 0) {
        await prisma.$executeRawUnsafe(
          `UPDATE "User" SET ${setClauses.join(", ")} WHERE "id" = $${pIdx}`,
          ...values
        );
      }

      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id", "name", "email", "role", "adminPermissions", "updatedAt" FROM "User" WHERE "id" = $1 LIMIT 1`,
        userId
      );
      updatedUser = rows[0] || { id: userId, email: targetUser.email, role: updateData.role || targetUser.role, adminPermissions: updateData.adminPermissions || [] };
    }

    const isPromoted = updatedUser.role !== "USER";
    return NextResponse.json({
      success: true,
      message: isPromoted
        ? `User ${updatedUser.email} is now ${updatedUser.role} with ${(updatedUser.adminPermissions || []).length} permissions.`
        : `User ${updatedUser.email} has been demoted back to standard USER.`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/staff error:", error);
    return NextResponse.json({ error: error.message || "Failed to update admin staff permissions" }, { status: 500 });
  }
}

// DELETE /api/admin/staff -> Revoke admin access for a user (demotes to regular USER)
export async function DELETE(req: Request) {
  try {
    await ensureDbSchema();
    const auth = await getAdminAuth("ADMINS_MANAGE");
    if (auth.error || !auth.admin) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    let targetUser: any = null;
    try {
      targetUser = await (prisma as any).user.findUnique({
        where: { id: userId },
      });
    } catch {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT "id", "email" FROM "User" WHERE "id" = $1 LIMIT 1`,
        userId
      );
      if (rows && rows.length > 0) targetUser = rows[0];
    }

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const targetEmailLower = (targetUser.email || "").toLowerCase().trim();
    if (SUPER_ADMIN_EMAILS.includes(targetEmailLower)) {
      return NextResponse.json({ error: "Cannot revoke permissions for primary Super Admin." }, { status: 400 });
    }

    try {
      await (prisma as any).user.update({
        where: { id: userId },
        data: {
          role: "USER",
          adminPermissions: [],
        },
      });
    } catch {
      await prisma.$executeRawUnsafe(
        `UPDATE "User" SET "role" = 'USER', "adminPermissions" = ARRAY[]::TEXT[], "updatedAt" = NOW() WHERE "id" = $1`,
        userId
      );
    }

    return NextResponse.json({
      success: true,
      message: `Admin access for ${targetUser.email} has been revoked.`,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/staff error:", error);
    return NextResponse.json({ error: error.message || "Failed to revoke admin access" }, { status: 500 });
  }
}

