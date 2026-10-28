const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];

async function main() {
  for (const name of CITIES) {
    await prisma.city.upsert({ where: { name }, update: {}, create: { name } });
  }
  const mobile = process.env.ADMIN_MOBILE || '03000000000';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.ADMIN_NAME || 'SmartRider Admin';
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { mobile },
    update: {},
    create: { name, mobile, passwordHash, role: 'ADMIN', mobileVerified: true }
  });
  console.log(`Seed done. Cities: ${CITIES.length}. Admin login -> mobile: ${mobile}`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
