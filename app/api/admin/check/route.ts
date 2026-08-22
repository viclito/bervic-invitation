import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const auth = await getAdminAuth();
    if (auth.error || !auth.admin) {
      return NextResponse.json({
        isLoggedIn: false,
        isAdmin: false,
        isSuperAdmin: false,
        role: 'USER',
        adminPermissions: [],
      });
    }

    return NextResponse.json({
      isLoggedIn: true,
      isAdmin: true,
      isSuperAdmin: auth.admin.isSuperAdmin,
      role: auth.admin.role,
      adminPermissions: auth.admin.adminPermissions || [],
      admin: auth.admin,
    });
  } catch {
    return NextResponse.json({
      isLoggedIn: false,
      isAdmin: false,
      isSuperAdmin: false,
      role: 'USER',
      adminPermissions: [],
    });
  }
}
