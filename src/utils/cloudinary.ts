import type { RequestEventAction } from '@builder.io/qwik-city';
import { Cloudinary } from '@cloudinary/url-gen';
import { CLOUDINARY_NAME } from '~/const/cloudinary';

let client: Cloudinary | null = null;

export const cloudinaryUpload = async (avatarUrl: string, requestEvent: RequestEventAction) => {
  if (!requestEvent.env.get('CLOUDINARY_PRESET_PROFILEPIC')) throw Error('Server ENV error!');
  try {
    const uploadTo = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`;

    const formData = new FormData();
    formData.append('upload_preset', requestEvent.env.get('CLOUDINARY_PRESET_PROFILEPIC')!);
    formData.append('file', avatarUrl);

    const result = await fetch(uploadTo, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    return result;
  } catch (e) {
    console.error(e);
  }
};

export const initCloudinaryIfNeeded = () => {
  if (!client) {
    client = new Cloudinary({ cloud: { cloudName: CLOUDINARY_NAME } });
  }
};

export default () => {
  if (!client) throw new Error('Cloudinary not initialized');
  return client;
};
