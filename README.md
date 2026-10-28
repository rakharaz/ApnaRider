# SmartRider (Apna Rider) — Phase 1 Starter

Next.js 14 (App Router) + Prisma + MySQL + Tailwind CSS.

## Phase 1 mein kya hai
- Customer / Rider registration aur login (mobile ya email + password)
- Role-based access: `/customer`, `/rider`, `/admin` (middleware se protected)
- 5 failed login attempts par 15 minute ka account lock
- Customer registration par default delivery address save hota hai
- Rider registration (CNIC, vehicle) -> Admin verification ke baad approve
- Admin dashboard (counts) aur Riders page (Approve / Suspend)
- Baqi modules ke placeholder cards (Phase 2 se 6)

## Setup (Windows + XAMPP)
1. **Node.js 18.17+** install karein (nodejs.org, LTS).
2. XAMPP Control Panel mein **MySQL Start** karein.
3. Project folder mein terminal kholen:
   ```
   npm install
   copy .env.example .env
   ```
4. `.env` file kholen:
   - `DATABASE_URL` — XAMPP default `mysql://root:@localhost:3306/smartrider` hai (agar root ka password hai to `root:PASSWORD@`).
   - `AUTH_SECRET` — koi lambi random string. Generate karne ke liye:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. Database tables banayein aur cities + admin seed karein:
   ```
   npx prisma db push
   npm run db:seed
   ```
6. Run:
   ```
   npm run dev
   ```
   Browser mein http://localhost:3000 kholen.

## Default Admin login
Mobile: `03000000000`   Password: `Admin@12345`
(`.env` mein `ADMIN_MOBILE` / `ADMIN_PASSWORD` se badal sakte hain, seed se pehle.) **Deploy se pehle password zaroor badlein.**

## Test flow
1. `/register` par Customer account banayein -> customer dashboard khulega.
2. Logout karke Rider account banayein -> "awaiting verification" dikhega.
3. Admin se login karein -> `/admin/riders` par rider ko Approve karein.
4. Rider dobara login/refresh karein -> status "verified".

## Folder structure
```
prisma/            schema.prisma, seed.js
src/middleware.js  role-based route protection
src/lib/           db.js, jwt.js, auth.js, validators.js
src/app/           pages (login, register, customer, rider, admin) + api/auth/*
src/components/    Navbar, ModuleCard
```

## Aglay phases
2: Items + city-wise rates + shopping list | 3: Orders, assignment, rider availability |
4: Price approval + bill | 5: Status tracking + ETA | 6: Admin reports

## Notes
- OTP mobile verification abhi nahi hai (SMS gateway chahiye); `mobileVerified` field schema mein ready hai.
- Prisma Studio se data dekhne ke liye: `npm run db:studio`
