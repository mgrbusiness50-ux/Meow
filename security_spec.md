# Meow Firestore Security Specification (Phase 0 & Phase 5)

## 1. Data Invariants
1. **Default-Deny Global Net:** No collection or subcollection is accessible unless explicitly matched and satisfied.
2. **PII Isolation:** `email` and `phone` MUST live exclusively in `users/{userId}/private/info` and may never be read or listed by non-owners. Phone visibility defaults to `showPhoneInProfile: false`.
3. **Owner & Participant Integrity:**
   - Users may only mutate their own `users/{userId}`, `users/{userId}/private/info`, `users/{userId}/notifications/{notificationId}`, and `users/{userId}/blockedUsers/{blockedUserId}`.
   - Pets (`pets/{petId}`) must have `ownerId == request.auth.uid` on create and retain immutable `ownerId` and `createdAt` on update.
   - Contact requests (`contactRequests/{requestId}`) may only be created by `senderId == request.auth.uid` in `'pending'` status, and read/listed solely by `senderId` or `receiverOwnerId`.
   - Terminal State Locking: Once a `contactRequest` reaches `'rejected'`, no further updates are permitted. Once `'accepted'`, status cannot change, and participants may only toggle their own celebration flag (`celebratedBySender` or `celebratedByReceiver`) from `false` to `true`.
   - Messages in `conversations/{conversationId}/messages/{messageId}` strictly use the Master Gate (`get()` on parent conversation) to verify `request.auth.uid == participantA || request.auth.uid == participantB`.
4. **Temporal & ID Hardening:** All path variables are checked via `isValidId()`, all strings enforce `.size()` upper bounds matching `firebase-blueprint.json`, and `createdAt`/`updatedAt` strictly equal `request.time`.

## 2. The "Dirty Dozen" Attack Payloads
1. **Unauthenticated PII Read:** Unauthenticated `get` on `/users/uid1/private/info` -> `PERMISSION_DENIED`.
2. **Cross-User PII Read:** User B reads `/users/uid1/private/info` -> `PERMISSION_DENIED`.
3. **Identity Spoofing on Pet Create:** User A creates `/pets/pet1` with `ownerId: "uidB"` -> `PERMISSION_DENIED`.
4. **Shadow / Ghost Field Injection:** User A creates `/users/uidA` with `{ ..., isAdmin: true }` -> `PERMISSION_DENIED` (`hasOnly` check).
5. **Client Timestamp Forgery:** User A creates `/pets/pet1` with `createdAt: "2020-01-01T00:00:00Z"` instead of server `request.time` -> `PERMISSION_DENIED`.
6. **ID Poisoning:** User A attempts `create` on `/pets/${"A".repeat(200)}` -> `PERMISSION_DENIED` (`isValidId` <= 128 chars, alphanumeric/`_`/`-`).
7. **Bypass Approval State:** Sender creates `/contactRequests/req1` with `status: "accepted"` directly -> `PERMISSION_DENIED`.
8. **Terminal State Violation:** Receiver changes an already `'rejected'` `/contactRequests/req1` back to `'accepted'` -> `PERMISSION_DENIED`.
9. **Unauthorized Status Approval:** Third-party User C attempts `update` on `/contactRequests/req1` to approve it -> `PERMISSION_DENIED`.
10. **Orphan / Non-Participant Message Injection:** User C writes to `/conversations/conv1/messages/msg1` where `participantA`/`participantB` are User A and User B -> `PERMISSION_DENIED`.
11. **Query Scraping (`list` without owner filter):** User A executes `getDocs(collection(db, 'contactRequests'))` without filtering by `senderId` or `receiverOwnerId` -> `PERMISSION_DENIED`.
12. **Unverified Email Spoof Write:** Authenticated user with `email_verified: false` attempts write on `/pets/pet1` -> `PERMISSION_DENIED`.

## 3. Red Team Audit Summary
- **Shadow Update Test:** Blocked by `keys().hasOnly(...)` on create and `affectedKeys().hasOnly(...)` per action branch on update.
- **Email Spoofing Test:** Blocked by `isVerifiedUser()` checking `request.auth.token.email_verified == true`.
- **PII Blanket Test:** Blocked by isolating `email` and `phone` to `users/{userId}/private/info` (`allow read, write: if isOwner(userId)`).
- **Query Trust Test:** Blocked by enforcing `resource.data` ownership/participant checks on every `allow list` rule (`pets` public browse only allows `status in ['mating', 'adoption']` or `ownerId == uid`).
