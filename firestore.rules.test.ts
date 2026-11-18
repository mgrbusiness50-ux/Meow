/**
 * Firestore Security Rules Verification Spec ("Dirty Dozen" Red-Team Test Suite)
 * Validates that every attack vector in security_spec.md is rejected by firestore.rules.
 */
export interface DirtyDozenScenario {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  authUid: string | null;
  emailVerified: boolean;
  payload?: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_SCENARIOS: DirtyDozenScenario[] = [
  {
    id: 1,
    name: 'Unauthenticated PII Read',
    collectionPath: '/users/user_a/private/info',
    operation: 'get',
    authUid: null,
    emailVerified: false,
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Cross-User PII Read',
    collectionPath: '/users/user_a/private/info',
    operation: 'get',
    authUid: 'user_b',
    emailVerified: true,
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Identity Spoofing on Pet Create',
    collectionPath: '/pets/pet_spoof',
    operation: 'create',
    authUid: 'user_a',
    emailVerified: true,
    payload: { id: 'pet_spoof', ownerId: 'user_b', name: 'SpoofCat' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow / Ghost Field Injection (isAdmin)',
    collectionPath: '/users/user_a',
    operation: 'create',
    authUid: 'user_a',
    emailVerified: true,
    payload: { uid: 'user_a', name: 'A', isAdmin: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Client Timestamp Forgery',
    collectionPath: '/pets/pet_bad_time',
    operation: 'create',
    authUid: 'user_a',
    emailVerified: true,
    payload: { id: 'pet_bad_time', ownerId: 'user_a', createdAt: '2020-01-01T00:00:00Z' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'ID Poisoning (>128 chars)',
    collectionPath: `/pets/${'A'.repeat(150)}`,
    operation: 'create',
    authUid: 'user_a',
    emailVerified: true,
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Bypass Approval State on Request Create',
    collectionPath: '/contactRequests/req_bypass',
    operation: 'create',
    authUid: 'user_a',
    emailVerified: true,
    payload: { id: 'req_bypass', senderId: 'user_a', status: 'accepted' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Terminal State Violation on Rejected Request',
    collectionPath: '/contactRequests/req_rejected',
    operation: 'update',
    authUid: 'user_b',
    emailVerified: true,
    payload: { status: 'accepted' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Unauthorized Third-Party Request Approval',
    collectionPath: '/contactRequests/req_pending',
    operation: 'update',
    authUid: 'user_c',
    emailVerified: true,
    payload: { status: 'accepted' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Non-Participant Conversation Message Injection',
    collectionPath: '/conversations/conv_ab/messages/msg_c',
    operation: 'create',
    authUid: 'user_c',
    emailVerified: true,
    payload: { id: 'msg_c', conversationId: 'conv_ab', senderId: 'user_c', text: 'intrusion' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unfiltered Collection List Scraping',
    collectionPath: '/contactRequests',
    operation: 'list',
    authUid: 'user_a',
    emailVerified: true,
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unverified Email Write Attempt',
    collectionPath: '/pets/pet_unverified',
    operation: 'create',
    authUid: 'user_a',
    emailVerified: false,
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
