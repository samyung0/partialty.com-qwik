import { content } from './schema/content';
import { content_category } from './schema/content_category';
import { content_index } from './schema/content_index';
import { content_share_token } from './schema/content_share_token';
import { content_user_progress } from './schema/content_user_progress';
import { content_user_quiz } from './schema/content_user_quiz';
import { course_approval } from './schema/course_approval';
import { email_verification_token } from './schema/email_verification_token';
import { mux_assets } from './schema/mux_assets';
import { profiles } from './schema/profiles';
import { tag } from './schema/tag';
import { user_key } from './schema/user_key';
import { user_session } from './schema/user_session';

export default {
  email_verification_token,
  profiles,
  user_key,
  user_session,
  content,
  content_index,
  tag,
  mux_assets,
  content_user_quiz,
  content_category,
  course_approval,
  content_user_progress,
  content_share_token,
};
