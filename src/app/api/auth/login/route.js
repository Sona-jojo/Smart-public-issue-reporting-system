import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["admin", "secretary", "engineer"]),
});

const roleConfig = {
  admin: {
    email: process.env.ADMIN_EMAIL ?? "admin@panchayath.gov",
    password: process.env.ADMIN_PASSWORD ?? "Admin@123",
    name: "System Admin",
  },
  secretary: {
    email: process.env.SECRETARY_EMAIL ?? "secretary@panchayath.gov",
    password: process.env.SECRETARY_PASSWORD ?? "Secretary@123",
    name: "Panchayath Secretary",
  },
  engineer: {
    email: process.env.ENGINEER_EMAIL ?? "engineer@panchayath.gov",
    password: process.env.ENGINEER_PASSWORD ?? "Engineer@123",
    name: "Section Engineer",
  },
};

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid login payload." },
      { status: 400 },
    );
  }

  const { email, password, role } = parsed.data;
  const account = roleConfig[role];

  if (email !== account.email || password !== account.password) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials for selected role." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Login successful.",
    data: {
      role,
      name: account.name,
      sessionToken: randomUUID(),
    },
  });
}
