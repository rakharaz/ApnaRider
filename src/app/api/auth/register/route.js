import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { setSessionCookie, dashboardFor } from '@/lib/auth';
import { normalizeMobile, isValidMobile, normalizeCnic, isValidCnic, isValidEmail, VEHICLE_TYPES } from '@/lib/validators';

const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return bad('Invalid request'); }

  const role = b.role === 'RIDER' ? 'RIDER' : 'CUSTOMER';
  const name = String(b.name || '').trim();
  const mobile = normalizeMobile(b.mobile);
  const email = String(b.email || '').trim().toLowerCase() || null;
  const password = String(b.password || '');
  const cityId = Number(b.cityId);

  if (name.length < 3) return bad('Please enter your full name.');
  if (!isValidMobile(mobile)) return bad('Enter a valid mobile number (e.g. 03001234567).');
  if (email && !isValidEmail(email)) return bad('Enter a valid email address.');
  if (password.length < 8) return bad('Password must be at least 8 characters.');

  const city = await prisma.city.findFirst({ where: { id: cityId || -1, isActive: true } });
  if (!city) return bad('Please select a city.');

  let extra = {};
  if (role === 'CUSTOMER') {
    const address = String(b.address || '').trim();
    if (address.length < 8) return bad('Please enter your delivery address.');
    extra = { addresses: { create: { label: 'Home', fullAddress: address, cityId: city.id, isDefault: true } } };
  } else {
    const cnic = normalizeCnic(b.cnic);
    const vehicleType = String(b.vehicleType || '');
    const vehicleNo = String(b.vehicleNo || '').trim().toUpperCase();
    if (!isValidCnic(cnic)) return bad('CNIC must be 13 digits.');
    if (!VEHICLE_TYPES.includes(vehicleType)) return bad('Please select a vehicle type.');
    if (vehicleNo.length < 3) return bad('Please enter your vehicle number.');
    if (await prisma.riderProfile.findUnique({ where: { cnic } })) return bad('A rider with this CNIC is already registered.', 409);
    extra = { riderProfile: { create: { cnic, vehicleType, vehicleNo, cityId: city.id } } };
  }

  if (await prisma.user.findUnique({ where: { mobile } })) return bad('This mobile number is already registered.', 409);
  if (email && (await prisma.user.findUnique({ where: { email } }))) return bad('This email is already registered.', 409);

  const user = await prisma.user.create({
    data: { name, mobile, email, role, cityId: city.id, passwordHash: await bcrypt.hash(password, 10), ...extra }
  });

  await setSessionCookie(user);
  return NextResponse.json({ redirect: dashboardFor(user.role) }, { status: 201 });
}
