# Security Specification for AsaanBusSafar

## 1. Data Invariants
- `buses`: Reference data for routes and timings. Writable only by verified Admins. Read access for all users.
- `users`: User profiles. Users can only read and update their own profiles. Identity is tied to `request.auth.uid`.
- `contributions`: Community-submitted routes. Create access for authenticated users. Read/Delete access restricted to Admins.
- `feedback`, `complaints`, `reports`: Transactional user interactions. Create access for all users (or authenticated, depending on policy). Read access restricted to Admins.
- `ratings`: User reviews for bus services. Create access for authenticated users. Read access for all.
- `admins`: Security critical collection defining roles. Read access for authenticated users (required for UI logic). Writes strictly forbidden via client SDK.

## 2. The "Dirty Dozen" Payloads (Rejection Targets)
1. **Admin Spoofing:** Attempting to write to the `buses` collection as a non-admin authenticated user.
2. **Profile Hijacking:** Attempting to update another user's profile in the `users` collection.
3. **Anonymous Contribution:** Attempting to create a `contribution` without being signed in.
4. **Type Poisoning:** Attempting to update a `bus` fare with a string instead of a number.
5. **ID Bloating:** Attempting to create a `bus` with a document ID longer than 128 characters.
6. **Unauthorized Deletion:** Attempting to delete a `bus` entry as a normal user.
7. **Privilege Escalation:** Attempting to inject a `role: "admin"` field into a user's own profile.
8. **Public Admin List:** Attempting to read the `admins` collection as an unauthenticated user.
9. **Denial of Wallet:** Attempting to create a `contribution` with a massive 1MB `note`.
10. **Immutable Field Tampering:** Attempting to update the `submittedAt` timestamp of a `contribution`.
11. **User Scraping:** Attempting to list all documents in the `users` collection as a standard user.
12. **Incomplete Schema:** Attempting to create a `bus` entry missing the required `companyName` or `origin`.

## 3. Test Runner Invariants
- All "create" operations on `contributions` must verify the user's UID matches `request.auth.uid`.
- All "write" operations on `buses` must be rejected unless `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
- All "list" operations on restricted collections must be rejected.
