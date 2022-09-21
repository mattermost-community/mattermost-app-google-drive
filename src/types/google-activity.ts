import { GoogleCommentSubtypeEnum } from "../constant/google-activity-comment";

export interface GA$QueryDriveActivityResponse {
   activities?: GA$DriveActivity[];
   nextPageToken?: string | null;
}

export interface GA$DriveActivity {
   actions?: GA$Action[];
   actors?: GA$Actor[];
   primaryActionDetail?: GA$ActionDetail;
   targets?: GA$Target[];
   timeRange?: GA$TimeRange;
   timestamp?: string | null;
}

export interface GA$Action {
   actor?: GA$Actor;
   detail?: GA$ActionDetail;
   target?: GA$Target;
   timeRange?: GA$TimeRange;
   timestamp?: string | null;
}

export interface GA$Actor {
   administrator?: any;
   anonymous?: any;
   impersonation?: any;
   system?: any;
   user?: GA$User;
}

export interface GA$User {
   deletedUser?: any;
   knownUser?: GA$KnownUser;
   unknownUser?: any;
}

export interface GA$KnownUser {
   isCurrentUser?: boolean | null;
   personName?: string | null;
}

export interface GA$ActionDetail {
   comment?: GA$Comment;
   create?: GA$Create;
   delete?: any;
   dlpChange?: any;
   edit?: any;
   move?: any;
   permissionChange?: any;
   reference?: any;
   rename?: any;
   restore?: any;
   settingsChange?: any;
}

export interface GA$Target {
   drive?: any;
   driveItem?: any;
   fileComment?: GA$FileComment;
   teamDrive?: any;
}

export interface GA$TimeRange {
   endTime?: string | null;
   startTime?: string | null;
}

export interface GA$Copy {
   originalObject?: any;
}

export interface GA$Create {
   copy?: GA$Copy;
   new?: any;
   upload?: any;
}

export interface GA$Comment {
   assignment?: GA$Assignment;
   mentionedUsers?: GA$User[];
   post?: {
      subtype?: GA$CommentSubtype;
   },
   suggestion?: {
      subtype?: string | null;
   }
}

export interface GA$Assignment {
   assignedUser?: GA$User;
   subtype?: string | null;
}

export interface GA$FileComment {
   legacyCommentId?: string | null;
   legacyDiscussionId?: string | null;
   linkToDiscussion?: string | null;
   parent?: Schema$DriveItem;
}

export interface Schema$DriveItem {
   driveFile?: any;
   driveFolder?: GA$DriveFolder;
   file?: any;
   folder?: any;
   mimeType?: string | null;
   name?: string | null;
   owner?: any;
   title?: string | null;
}

export interface GA$DriveFolder {
   type?: string | null;
}

export type GA$CommentSubtype = 
   'SUBTYPE_UNSPECIFIED' |	//Subtype not available.
   'ADDED' |	//A post was added.
   'DELETED' |	// A post was deleted.
   'REPLY_ADDED' |	// A reply was added.
   'REPLY_DELETED' |	// A reply was deleted.
   'RESOLVED' |	// A posted comment was resolved.
   'REOPENED'; // A posted comment was reopened.

