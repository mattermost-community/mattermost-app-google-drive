import { drive_v3 } from 'googleapis';
import { head, last } from 'lodash';

import { getGoogleDriveClient } from '../../clients/google-client';
import { ActionsEvents, AppBindingLocations, AppExpandLevels, ExceptionType, Routes } from '../../constant';
import manifest from '../../manifest.json';
import { GA$Comment, GA$CommentSubtype, GA$DriveActivity, GA$SuggestionSubtype, GA$Target, PostBasicData, Schema$About, Schema$Comment, Schema$File, Schema$Reply, Schema$User, StateCommentPost, User, WebhookRequest } from '../../types';
import { bold, h5, hyperlink, inLineImage } from '../../utils/markdown';
import { postBotChannel } from '../../utils/post-in-channel';
import { configureI18n } from '../../utils/translations';
import { tryPromise } from '../../utils/utils';

import { displayUserActor } from './get-mm-username';
type CallbackFunction = (call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) => void;

export async function manageCommentOnFile(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity): Promise<void> {
    const activityComment: GA$Comment | undefined = activity.primaryActionDetail?.comment;
    const post = activityComment?.post;
    const postSubtype: GA$CommentSubtype | null | undefined = post?.subtype;

    if (postSubtype) {
        const postAction: CallbackFunction | null = COMMENT_ACTIONS[postSubtype];

        if (postAction) {
            await postAction(call, file, activity);
            return;
        }
    }

    const suggestion = activityComment?.suggestion;
    const suggestionSubtype: GA$SuggestionSubtype | null | undefined = suggestion?.subtype;

    if (suggestionSubtype) {
        const suggestionAction: CallbackFunction = SUGGESTIONS_ACTIONS[suggestionSubtype];

        if (suggestionAction) {
            await suggestionAction(call, file, activity);
        }
    }
}

const COMMENT_ACTIONS: { [key in GA$CommentSubtype]: CallbackFunction } = {
    SUBTYPE_UNSPECIFIED: funCommentSubtypeUnspecified,
    ADDED: funCommentAdded,
    DELETED: funCommentDeleted,
    REPLY_ADDED: funCommentReplyAdded,
    REPLY_DELETED: funCommentReplyDeleted,
    RESOLVED: funCommentResolved,
    REOPENED: funCommentReOpened,
};

const SUGGESTIONS_ACTIONS: { [key in GA$SuggestionSubtype]: CallbackFunction } = {
    REPLY_ADDED: funSuggestionReplyAdded,
};

async function funSuggestionReplyAdded(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);

    const target: GA$Target | undefined = head(activity.targets);
    if (!target) {
        return;
    }
    const urlToComment: string | null | undefined = target.fileComment?.linkToDiscussion;

    const fileId: string | null | undefined = file.id;
    const commentId: string | null | undefined = target.fileComment?.legacyDiscussionId;
    const lastModifyingUser: Schema$User | undefined = file.lastModifyingUser;

    if (!fileId || !commentId) {
        return;
    }

    const userDisplay: string = await displayUserActor(call, lastModifyingUser);
    const message = h5(i18nObj.__('comments.reply.suggestion',
        {
            userDisplay,
            image: inLineImage(i18nObj.__('comments.file-icon'), `${file?.iconLink} =15x15`),
            link: hyperlink(`${file?.name}`, `${urlToComment}`),
        })
    );

    await postBotChannel(call, message, {});
}

async function funCommentSubtypeUnspecified(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);
}

async function funCommentAdded(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);

    const drive: drive_v3.Drive = await getGoogleDriveClient(call);
    const target: GA$Target | undefined = head(activity.targets);

    if (!target) {
        return;
    }

    const commentId: string | null | undefined = target.fileComment?.legacyCommentId;
    const fileId: string | null | undefined = file.id;
    if (!commentId || !fileId) {
        return;
    }

    const urlToComment: string | null | undefined = target.fileComment?.linkToDiscussion;
    const about: Schema$About = await tryPromise<Schema$About>(drive.about.get({ fields: 'user' }), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'), call);

    const commentParam = {
        fileId,
        commentId,
        fields: '*',
    };

    const comment: Schema$Comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'), call);
    const author: Schema$User | undefined = comment.author;
    const userDisplay: string = await displayUserActor(call, author);

    const mentions: string = comment.content?.includes(`${about.user.emailAddress}`) ?
        'comments.add.text-mentioned' :
        'comments.add.text-comment';

    const message: string = h5(i18nObj.__(mentions,
        {
            userDisplay,
            image: inLineImage(i18nObj.__('comments.file-icon'), `${file?.iconLink} =15x15`),
            link: hyperlink(`${file?.name}`, `${urlToComment}`),
        })
    );

    const description = `${comment.quotedFileContent?.value || ' '}\n ___ \n> ${comment.content}`;

    const postData: PostBasicData = {
        message,
        description,
    };

    const state: StateCommentPost = {
        comment: {
            id: commentId,
        },
        file: {
            id: fileId,
        },
    };
    await postNewCommentOnMattermost(call, postData, state);
}

async function funCommentReplyAdded(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);

    const drive = await getGoogleDriveClient(call);
    const target: GA$Target | undefined = head(activity.targets);
    if (!target) {
        return;
    }

    const urlToComment: string | null | undefined = target.fileComment?.linkToDiscussion;
    const fileId: string | null | undefined = file.id;
    const commentId: string | null | undefined = target.fileComment?.legacyDiscussionId;

    if (!fileId || !commentId) {
        return;
    }

    const commentParam = {
        fileId,
        commentId,
        includeDeleted: true,
        fields: '*',
    };

    const comment: Schema$Comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'), call);
    const replies: Schema$Reply[] | undefined = comment.replies;

    if (!replies) {
        return;
    }

    const lastReply: Schema$Reply | undefined = last(replies);
    const oneBeforeLast: Schema$Reply | undefined = (replies).at(-2);
    if (!lastReply || !oneBeforeLast) {
        return;
    }

    const userDisplay: string = await displayUserActor(call, lastReply.author);
    const message: string = h5(i18nObj.__('comments.reply.comment',
        {
            userDisplay,
            image: inLineImage(i18nObj.__('comments.file-icon'), `${file?.iconLink} =15x15`),
            link: hyperlink(`${file?.name}`, `${urlToComment}`),
        }));

    const description = `${bold(i18nObj.__('comments.reply.previous'))}\n ${oneBeforeLast.content || ' '}\n ___ \n> ${lastReply.content}`;

    const postData: PostBasicData = {
        message,
        description,
    };
    const state: StateCommentPost = {
        comment: {
            id: commentId,
        },
        file: {
            id: fileId,
        },
    };
    await postNewCommentOnMattermost(call, postData, state);
}

async function funCommentResolved(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);

    const drive = await getGoogleDriveClient(call);
    const target: GA$Target | undefined = head(activity.targets);

    if (!target) {
        return;
    }
    const urlToComment: string | null | undefined = target.fileComment?.linkToDiscussion;
    const fileId: string | null | undefined = file.id;
    const commentId: string | null | undefined = target.fileComment?.legacyDiscussionId;

    if (!fileId || !commentId) {
        return;
    }

    const commentParam = {
        fileId,
        commentId,
        fields: '*',
    };

    const comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'), call);
    const userDisplay: string = await displayUserActor(call, comment.author);

    const message = h5(i18nObj.__('comments.resolved.message',
        {
            userDisplay,
            image: inLineImage(i18nObj.__('comments.file-icon'), `${file?.iconLink} =15x15`),
            link: hyperlink(`${file?.name}`, `${urlToComment}`),
        }
    ));

    await postBotChannel(call, message, {});
}

async function funCommentReOpened(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);

    const drive = await getGoogleDriveClient(call);
    const target: GA$Target | undefined = head(activity.targets);
    if (!target) {
        return;
    }
    const urlToComment: string | null | undefined = target.fileComment?.linkToDiscussion;
    const fileId: string | null | undefined = file.id;
    const commentId: string | null | undefined = target.fileComment?.legacyDiscussionId;

    if (!fileId || !commentId) {
        return;
    }

    const commentParam = {
        fileId,
        commentId,
        fields: '*',
    };

    const comment = await tryPromise<Schema$Comment>(drive.comments.get(commentParam), ExceptionType.TEXT_ERROR, i18nObj.__('general.google-error'), call);
    const lastReply: Schema$Reply | undefined = last(comment.replies);
    if (!lastReply) {
        return;
    }
    const userDisplay: string = await displayUserActor(call, lastReply.author);

    const message = h5(i18nObj.__('comments.reopened.message',
        {
            userDisplay,
            image: inLineImage(i18nObj.__('comments.file-icon'), `${file?.iconLink} =15x15`),
            link: hyperlink(`${file?.name}`, `${urlToComment}`),
        }
    ));

    const description = `${bold(i18nObj.__('comments.reopened.comment'))}\n ${comment.content || ' '}\n ___ \n> ${lastReply.content}`;

    const postData: PostBasicData = {
        message,
        description,
    };
    const state: StateCommentPost = {
        comment: {
            id: commentId,
        },
        file: {
            id: fileId,
        },
    };
    await postNewCommentOnMattermost(call, postData, state);
}

async function funCommentDeleted(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);

    const target: GA$Target | undefined = head(activity.targets);
    if (!target) {
        return;
    }

    const urlToComment: string | undefined | null = target.fileComment?.linkToDiscussion;
    const message = h5(i18nObj.__('comments.delete.messsage',
        {
            image: inLineImage(i18nObj.__('general.google-error'), `${file?.iconLink} =15x15`),
            link: hyperlink(`${file?.name}`, `${urlToComment}`),
        }));
    await postBotChannel(call, message, {});
}

async function funCommentReplyDeleted(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity) {
    const i18nObj = configureI18n(call.context);

    const target: GA$Target | undefined = head(activity.targets);
    if (!target) {
        return;
    }
    const urlToComment: string | null | undefined = target.fileComment?.linkToDiscussion;

    const message = h5(i18nObj.__('comments.delete-reply.message',
        {
            image: inLineImage(i18nObj.__('general.google-error'), `${file?.iconLink} =15x15`),
            link: hyperlink(`${file?.name}`, `${urlToComment}`),
        }));
    await postBotChannel(call, message, {});
}

export async function postNewCommentOnMattermost(call: WebhookRequest, postData: PostBasicData, state: StateCommentPost): Promise<void> {
    const i18nObj = configureI18n(call.context);

    const props = {
        app_bindings: [
            {
                location: AppBindingLocations.EMBEDDED,
                app_id: manifest.app_id,
                description: postData.description,
                bindings: [
                    {
                        location: ActionsEvents.REPLY_COMMENTS,
                        label: i18nObj.__('comments.new.label'),
                        submit: {
                            path: Routes.App.CallPathCommentReplayForm,
                            expand: {
                                acting_user: AppExpandLevels.EXPAND_SUMMARY,
                                oauth2_user: AppExpandLevels.EXPAND_ALL,
                                oauth2_app: AppExpandLevels.EXPAND_ALL,
                                post: AppExpandLevels.EXPAND_SUMMARY,
                            },
                            state,
                        },
                    },
                ],
            },
        ],
    };
    await postBotChannel(call, postData.message, props);
}
