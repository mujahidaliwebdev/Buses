# Security Specification for ChaloBus

## 1. Data Invariants
- `buses`: Can only be modified by admins. Read access for everyone.
- `users`: Users can only read/write their own profile.
- `contributions`: Signed-in users can create. Admins can read/delete. Users cannot read other contributions.
- `admins`: Only readable by authenticated users (to check admin status), only writable by super-admins (not implemented via client).

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. Write to `buses` as a normal authenticated user.
2. Update another user's profile in `users`.
3. Create a `contribution` without being signed in.
4. Update a `bus` fare with a string instead of a number.
5. Create a `bus` with a plate number longer than 128 chars.
6. Delete a `bus` entry as a normal user.
7. Inject a `role: "admin"` field into a user profile.
8. Read the `admins` collection as an unauthenticated user.
9. Create a `contribution` with a massive 1MB `note`.
10. Update the `creatorId` of a `contribution` after it's been created.
11. List all `users` as a normal user.
12. Update a `bus` entry without including the required `companyName`.

## 3. Test Runner
(I'll focus on generating the rules next as per guidelines)
