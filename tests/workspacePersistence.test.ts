import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import type { Pet } from '../src/types.ts';
import { isValidUuid } from '../src/utils/uuid.ts';
import { extractGoogleAvatarUrl } from '../src/services/supabaseAuthService.ts';
import { mapContactFormToSupportInsert } from '../src/services/supabaseMappers.ts';

describe('Workspace persistence, UUIDs, incoming-only notifications, Google avatar, and support mapper', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it('starts with an empty workspace (zero mock pets, conversations, requests, or notifications)', async () => {
    const { state } = await import('../src/state.ts');

    expect(state.getFilteredMatingPets()).toEqual([]);
    expect(state.getFilteredAdoptionPets()).toEqual([]);
    expect(state.getUserPets()).toEqual([]);
    expect(state.getConversations()).toEqual([]);
    expect(state.getContactRequests()).toEqual([]);
    expect(state.getNotifications()).toEqual([]);
    expect(state.getPendingRequestsCount()).toBe(0);
  });

  it('uses RFC4122 UUIDs for pets & requests, counts only incoming pending requests, emits zero sender self-notifications, and supports withdraw', async () => {
    const { state } = await import('../src/state.ts');

    const myPet = state.savePet({
      name: 'لوزة',
      species: 'cat',
      breed: 'شيرازي',
      gender: 'female',
      ageYears: 1,
      ageMonths: 6,
      color: 'أبيض',
      city: 'القاهرة',
      status: 'mating',
      vaccinationStatus: 'vaccinated',
      healthStatus: 'healthy',
    });

    expect(isValidUuid(myPet.id)).toBe(true);
    expect(state.getPrimaryUserMatingPet()?.id).toBe(myPet.id);

    const targetPet: Pet = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'سمسم',
      species: 'cat',
      breed: 'شيرازي',
      ageYears: 2,
      ageMonths: 0,
      color: 'برتقالي',
      gender: 'male',
      photos: [],
      area: 'المعادي',
      city: 'القاهرة',
      distanceKm: 2,
      healthStatus: 'healthy',
      vaccinationStatus: 'vaccinated',
      personality: [],
      healthNotes: '',
      status: 'mating',
      ownerId: '22222222-2222-4222-8222-222222222222',
      ownerName: 'أحمد',
      ownerAvatar: '',
      createdAt: '2026-11-25',
    };

    const res = await state.sendContactRequestAsync(
      targetPet,
      'مرحباً، أرغب في التنسيق للتزاوج.',
      myPet.id
    );

    expect(res.success).toBe(true);
    expect(res.request).toBeDefined();
    expect(isValidUuid(res.request!.id)).toBe(true);

    // Outgoing request must NOT inflate incoming badge count or create a sender self-notification
    expect(state.getOutgoingContactRequests()).toHaveLength(1);
    expect(state.getIncomingContactRequests()).toHaveLength(0);
    expect(state.getPendingRequestsCount()).toBe(0);
    expect(state.getNotifications()).toHaveLength(0);

    // Withdrawing marks outgoing request as withdrawn
    state.withdrawContactRequest(res.request!.id);
    const updatedOutgoing = state.getOutgoingContactRequests()[0];
    expect(updatedOutgoing.isWithdrawn).toBe(true);
    expect(state.getPendingRequestsCount()).toBe(0);
  });

  it('extracts Google OAuth avatar from avatar_url, picture, or identities while ignoring unsafe schemes', () => {
    const fromAvatarUrl = {
      id: 'user-1',
      user_metadata: {
        avatar_url: 'https://lh3.googleusercontent.com/a/example-avatar',
      },
    } as unknown as User;
    expect(extractGoogleAvatarUrl(fromAvatarUrl)).toBe(
      'https://lh3.googleusercontent.com/a/example-avatar'
    );

    const fromPictureAndIdentity = {
      id: 'user-2',
      user_metadata: {
        avatar_url: 'javascript:alert(1)',
        picture: 'https://lh3.googleusercontent.com/a/picture-avatar',
      },
    } as unknown as User;
    expect(extractGoogleAvatarUrl(fromPictureAndIdentity)).toBe(
      'https://lh3.googleusercontent.com/a/picture-avatar'
    );

    const fromIdentity = {
      id: 'user-3',
      user_metadata: {},
      identities: [
        {
          identity_data: {
            avatar_url: 'https://lh3.googleusercontent.com/a/identity-avatar',
          },
        },
      ],
    } as unknown as User;
    expect(extractGoogleAvatarUrl(fromIdentity)).toBe(
      'https://lh3.googleusercontent.com/a/identity-avatar'
    );
  });

  it('maps and trims contact support form input into a Supabase insert payload', () => {
    const payload = mapContactFormToSupportInsert({
      userId: '33333333-3333-4333-8333-333333333333',
      senderName: '  سارة محمد  ',
      senderEmail: '  sara@example.com  ',
      senderPhone: ' 01012345678 ',
      subject: '  استفسار عن التزاوج  ',
      message: '  أحتاج مساعدة في تفعيل الحساب.  ',
    });

    expect(payload).toEqual({
      user_id: '33333333-3333-4333-8333-333333333333',
      sender_name: 'سارة محمد',
      sender_email: 'sara@example.com',
      sender_phone: '01012345678',
      subject: 'استفسار عن التزاوج',
      message: 'أحتاج مساعدة في تفعيل الحساب.',
    });
  });
});
