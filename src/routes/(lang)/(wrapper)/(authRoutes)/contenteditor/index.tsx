import { $, component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { routeLoader$, server$ } from '@builder.io/qwik-city';

import { eq } from 'drizzle-orm';
import LoadingSVG from '~/components/LoadingSVG';
import ContentEditor from '~/components/_ContentEditor';
import SideNav from '~/components/_ContentEditor/SideNav';
import { CLOUDINARY_NAME } from '~/const/cloudinary';
import { themeContext } from '~/context/themeContext';
import {
  useAccessibleCourseWrite,
  useAccessibleCourseWriteResolved,
} from '~/routes/(lang)/(wrapper)/(authRoutes)/creator';
import { useUserLoader } from '~/routes/(lang)/(wrapper)/(authRoutes)/layout';
import type { CloudinaryPublicPic } from '~/types/Cloudinary';
import type Mux from '~/types/Mux';
import drizzleClient from '~/utils/drizzleClient';
import getSQLTimeStamp from '~/utils/getSQLTimeStamp';
import saveToDBQuiz from '~/utils/quiz/saveToDBQuiz';
import useWS from '~/utils/useWS';
import { content } from '../../../../../../drizzle_turso/schema/content';
import { content_index } from '../../../../../../drizzle_turso/schema/content_index';
import { mux_assets } from '../../../../../../drizzle_turso/schema/mux_assets';

export { useAccessibleCourseWrite, useAccessibleCourseWriteResolved };

export const fetchAudioServer = server$(async function (id: string) {
  const audio = (await fetch('https://api.mux.com/video/v1/assets/' + id, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${btoa(this.env.get('MUX_PRODUCTION_ID')! + ':' + this.env.get('MUX_PRODUCTION_SECRET')!)}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((e) => console.error(e))) as any;
  const filename = (
    await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1')
      .select({ filename: mux_assets.name })
      .from(mux_assets)
      .where(eq(mux_assets.id, id))
  )[0].filename;
  audio.filename = filename;
  return audio as {
    data: Mux['data'][0];
    filename: string;
  };
});

const saveContentServer = server$(async function (
  chapterId: string,
  contentEditorValue2: string | null,
  renderedHTML2: string,
  audio_track_playback_id: string | undefined,
  audio_track_asset_id: string | undefined,
  courseId: string
) {
  try {
    const time = getSQLTimeStamp();
    const contentVal: any = {
      content_slate: contentEditorValue2,
      renderedHTML: renderedHTML2,
      updated_at: time,
    };
    contentVal['audio_track_playback_id'] = audio_track_playback_id || null;
    contentVal['audio_track_asset_id'] = audio_track_asset_id || null;
    return await drizzleClient(this.env, import.meta.env.VITE_USE_PROD_DB === '1').transaction(async (tx) => {
      await tx.update(content_index).set({ updated_at: time }).where(eq(content_index.id, courseId));
      return await tx.update(content).set(contentVal).where(eq(content.id, chapterId)).returning();
    });
  } catch (e) {
    return [false, e];
  }
});

export const useUserAssets = routeLoader$(async (requestEvent) => {
  const ret: {
    cloudinaryImages: CloudinaryPublicPic[];
    muxAudiosWithNames: [Mux['data'][0], string][];
    accessible_courses: string[];
  } = { cloudinaryImages: [], muxAudiosWithNames: [], accessible_courses: [] };
  const user = await requestEvent.resolveValue(useUserLoader);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/resources/search`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(
        requestEvent.env.get('CLOUDINARY_API_KEY')! + ':' + requestEvent.env.get('CLOUDINARY_API_SECRET')!
      )}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expression: `folder:public/${user.userId}/*`,
      max_results: 999999,
    }),
  })
    .then((res) => res.json())
    .catch((e) => console.error(e));
  const userMuxAssets =
    user.role === 'admin'
      ? await drizzleClient(requestEvent.env, import.meta.env.VITE_USE_PROD_DB === '1')
          .select()
          .from(mux_assets)
      : await drizzleClient(requestEvent.env, import.meta.env.VITE_USE_PROD_DB === '1')
          .select()
          .from(mux_assets)
          .where(eq(mux_assets.user_id, user.userId));
  const _muxAudios = await Promise.allSettled(
    userMuxAssets.map(
      (asset) =>
        fetch('https://api.mux.com/video/v1/assets/' + asset.id, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${btoa(
              requestEvent.env.get('MUX_PRODUCTION_ID')! + ':' + requestEvent.env.get('MUX_PRODUCTION_SECRET')!
            )}`,
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .catch((e) => console.error(e)) as Promise<{ data: Mux['data'][0] }>
    )
  );
  const muxAudios = _muxAudios.filter(
    (res) => res.status === 'fulfilled' && res.value.data.resolution_tier === 'audio-only'
  ) as PromiseFulfilledResult<{ data: Mux['data'][0] }>[];
  const muxAudiosWithNames = muxAudios.map((audioFile) => [
    audioFile.value.data,
    userMuxAssets.find((asset) => asset.id === audioFile.value.data.id)!.name,
  ]) as [Mux['data'][0], string][];
  muxAudiosWithNames.sort((a, b) => Number(b[0].created_at) - Number(a[0].created_at));
  ret.muxAudiosWithNames = muxAudiosWithNames;

  if (!res || !res.resources) return ret;
  ret.cloudinaryImages = res.resources;

  try {
    if (user.role === 'admin') ret.accessible_courses = ['*'];
    else ret.accessible_courses = JSON.parse(user.accessible_courses || '[]');
  } catch (e) {
    console.error(e);
    ret.accessible_courses = [];
  }
  return ret;
});

export default component$(() => {
  const user = useUserLoader().value;
  const userAssets = useUserAssets().value;
  const themeContent = useContext(themeContext);

  const userAccessibleCourseWrite = useAccessibleCourseWrite().value;
  const courseIdToEditingUser = useStore<Record<string, [string, string]>>({});
  const ws = useWS(user, {
    onOpen$: $((ws, useTimeStamp) => {
      ws.send(
        JSON.stringify({
          type: 'init',
          userId: useTimeStamp,
          accessible_courses: userAccessibleCourseWrite,
        })
      );
    }),
    onMessage$: $((ws, useTimeStamp, data) => {
      try {
        const d = JSON.parse(data);
        console.log(d);
        if (d.type === 'initUserEditing') {
          for (const i in courseIdToEditingUser) delete courseIdToEditingUser[i];
          for (const i in d.message) courseIdToEditingUser[i] = d.message[i];
          return;
        }
        if (d.type === 'addUserEditing') {
          for (const i in d.message) courseIdToEditingUser[i] = d.message[i];
          return;
        }
        if (d.type === 'removeUserEditing') {
          for (const i in d.message) delete courseIdToEditingUser[i];
          return;
        }
        if (d.type === 'error') {
          alert(d.message);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }),
  });
  const contentWS = ws.contentWS;
  const wsTimeStamp = ws.timeStamp;

  const contentEditorValue = useSignal<any>();
  const renderedHTML = useSignal<string>();
  const isEditing = useSignal(false);
  const chapterId = useSignal('');
  const courseId = useSignal('');
  const audioAssetId = useSignal<string | undefined>(undefined);
  const hasChanged = useSignal(false);
  const isPreviewing = useSignal(false);
  const chapterName = useSignal('');
  const openSmallCircleNav = useSignal(false);
  const openSideNav = useSignal(false);
  const usePlate = useSignal(false);

  const fetchAudio = $(async (id: string) => await fetchAudioServer(id));

  useVisibleTask$(async () => {
    window.onbeforeunload = () => {
      return true;
    };
    window.onunload = () => {
      return true;
    };
  });

  return (
    <main class="relative flex h-[100vh] w-full overflow-hidden bg-background-light-gray dark:bg-primary-dark-gray">
      <SideNav
        courseIdToEditingUser={courseIdToEditingUser}
        contentEditorValue={contentEditorValue}
        renderedHTML={renderedHTML}
        contentWS={contentWS}
        isEditing={isEditing}
        chapterId={chapterId}
        courseId={courseId}
        audioAssetId={audioAssetId}
        hasChanged={hasChanged}
        chapterName={chapterName}
        timeStamp={wsTimeStamp}
        openSideNav={openSideNav}
        usePlate={usePlate}
      />
      {contentWS.value && (
        <ContentEditor
          client:only
          usePlate={usePlate.value}
          toggleSideNav={$(() => (openSideNav.value = !openSideNav.value))}
          openSmallCircleNav={openSmallCircleNav.value}
          toggleSmallCircleNav={$(() => (openSmallCircleNav.value = !openSmallCircleNav.value))}
          themeValue={themeContent.value}
          saveToDBQuiz={$((isCorrect: boolean) =>
            saveToDBQuiz(isCorrect, user.userId, courseId.value, chapterId.value)
          )}
          chapterName={chapterName.value}
          isPreviewing={isPreviewing.value}
          setIsPreviewing={$((t: boolean) => (isPreviewing.value = t))}
          timeStamp={wsTimeStamp.value}
          isEditing={isEditing.value}
          initialValue={contentEditorValue.value}
          renderedHTML={renderedHTML.value}
          contentWS={contentWS.value}
          user={user}
          initialUserAssets={userAssets}
          chapterId={chapterId.value}
          hasChanged={hasChanged.value}
          audioAssetId={audioAssetId.value}
          setHasChanged={$(() => (hasChanged.value = true))}
          resetHasChanged={$(() => (hasChanged.value = false))}
          fetchAudio={fetchAudio}
          saveChanges={$(
            async (
              contentEditorValue2: string | null,
              renderedHTML2: string,
              audio_track_playback_id: string | undefined,
              audio_track_asset_id: string | undefined
            ) => {
              if (!isEditing.value) {
                console.error('Cannot save!');
                return '';
              }
              renderedHTML.value = renderedHTML2;
              const ret = (await saveContentServer(
                chapterId.value,
                contentEditorValue2,
                renderedHTML2,
                audio_track_playback_id,
                audio_track_asset_id,
                courseId.value
              )) as any[];
              if (ret.length > 0 && ret[0] === false) {
                alert('Save failed! ' + ret[1].toString());
                return '';
              }
              hasChanged.value = false;
              return '';
            }
          )}
        ></ContentEditor>
      )}
      {!contentWS.value && (
        <div class="flex h-full w-full items-center justify-center">
          <LoadingSVG />
        </div>
      )}
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Content Editor',
  meta: [
    {
      name: 'description',
      content: 'A content editor where you can create your own courses.',
    },
  ],
};
