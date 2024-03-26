import { globalAction$, zod$ } from '@builder.io/qwik-city';
import { eq } from 'drizzle-orm';
import bunApp from '~/_api/bun/util/edenTreaty';
import { auth } from '~/auth/lucia';
import type { CloudinaryDefaultPic } from '~/types/Cloudinary';
import { resetPasswordSchema, updateProfile } from '~/types/UpdateProfile';
import { cloudinaryUpload } from '~/utils/cloudinary';
import drizzleClient from '~/utils/drizzleClient';
import { profiles } from '../../drizzle_turso/schema/profiles';

export const useUpdateProfile = globalAction$(async (data, requestEvent) => {
  const { userId, nickname, avatar } = data;
  const { secure_url } = avatar as CloudinaryDefaultPic;

  try {
    const newAvatarUrl = await cloudinaryUpload(secure_url, requestEvent);

    const drizzle = drizzleClient(requestEvent.env, import.meta.env.VITE_USE_PROD_DB === '1');
    await drizzle
      .update(profiles)
      .set({ nickname: nickname, avatar_url: newAvatarUrl.secure_url })
      .where(eq(profiles.id, userId));
  } catch (e) {
    return requestEvent.fail(500, { message: (e as string).toString() });
  }
}, zod$(updateProfile));

export const useResetPassword = globalAction$(async (data, requestEvent) => {
  try {
    const hashVerification = await bunApp.auth.login.hashToPassword.post({
      time: Date.now(),
      password: data.oldPassword,
      hash: data.hash,
    });
    if (hashVerification.error || hashVerification.data.error)
      return requestEvent.fail(500, { message: hashVerification.data?.message });
    if (!hashVerification.data.isVerified) return requestEvent.fail(500, { message: 'Wrong old password!' });

    const Auth = auth(requestEvent.env, import.meta.env.VITE_USE_PROD_DB === '1');
    const user = await Auth.getUser(data.userId);
    await Auth.invalidateAllUserSessions(user.userId);
    await Auth.updateKeyPassword('email', user.email, data.newPassword);

    const session = await Auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = Auth.handleRequest(requestEvent);
    authRequest.setSession(session);
  } catch (e) {
    return requestEvent.fail(500, { message: (e as any).toString() });
  }
}, zod$(resetPasswordSchema));
