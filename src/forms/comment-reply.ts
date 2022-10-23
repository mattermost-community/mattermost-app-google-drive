import {MattermostClient} from "../clients";
import {getGoogleDriveClient} from "../clients/google-client";
import {AppExpandLevels, AppFieldSubTypes, AppFieldTypes, ExceptionType, GoogleDriveIcon, ReplyCommentForm, Routes} from '../constant';
import {AppCallRequest, AppForm, MattermostOptions, Params$Resource$Replies$Create, PostCreate,} from "../types";
import {CommentState, ReplyCommentFormType} from "../types/forms";
import {configureI18n} from "../utils/translations";
import {tryPromise} from "../utils/utils";

export async function openFormReplyComment(call: AppCallRequest): Promise<AppForm> {
	const i18nObj = configureI18n(call.context);

	const state = call.state;
	return {
		title: i18nObj.__('comment-reply.open-form-reply.title'),
		icon: GoogleDriveIcon,
		fields: [
			{
				type: AppFieldTypes.TEXT,
				name: ReplyCommentForm.RESPONSE,
				subtype: AppFieldSubTypes.TEXTAREA,
				modal_label: i18nObj.__('comment-reply.open-form-reply.label'),
				description: i18nObj.__('comment-reply.open-form-reply.description'),
				is_required: true,
			}
		],
		submit: {
			path: Routes.App.CallPathCommentReplaySubmit,
			expand: {
				acting_user: AppExpandLevels.EXPAND_SUMMARY,
				acting_user_access_token: AppExpandLevels.EXPAND_ALL,
				oauth2_user: AppExpandLevels.EXPAND_SUMMARY,
				oauth2_app: AppExpandLevels.EXPAND_SUMMARY,
				post: AppExpandLevels.EXPAND_SUMMARY
			},
			state
		},
	}
}

export async function manageReplyCommentSubmit(call: AppCallRequest): Promise<any> {
	const i18nObj = configureI18n(call.context);

	const drive = await getGoogleDriveClient(call);
	const comment: CommentState = call.state as CommentState;
	const values = call.values as ReplyCommentFormType;

	const newReply: Params$Resource$Replies$Create = {
		commentId: comment.comment.id,
		fileId: comment.file.id,
		fields: '*',
		requestBody: {
			content: values.google_response_comment
		}
	}

	await tryPromise<any>(drive.replies.create(newReply), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'));

	const mattermostUrl: string | undefined = call.context.mattermost_site_url;
	const postId: string | undefined = call.context.post?.id;
	const channelId: string | undefined = call.context.post?.channel_id;
	const actingUserID: string | undefined = call.context.acting_user?.id;
	const botAccessToken = call.context.bot_access_token as string;

	const mattermostOpts: MattermostOptions = {
		mattermostUrl: <string>mattermostUrl,
		accessToken: <string>botAccessToken
	};
	const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

	const post: PostCreate = {
		message: `${i18nObj.__('manage-reply-comment.message')}: \n"${values.google_response_comment}"`,
		user_id: <string>actingUserID,
		channel_id: <string>channelId,
		root_id: postId
	};
	await mmClient.createPost(post);
}
