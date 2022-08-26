export type GoogleToken = {
   refresh_token?: string | null;
   expiry_date?: number | null;
   access_token?: string | null;
   token_type?: string | null;
   id_token?: string | null;
   scope?: string;
}

export type GoogleTokenResponse = {
   tokens: GoogleToken,
   res: any
}

export interface StartPageToken {
   kind?: string | null;
   startPageToken?: string | null;
}

export interface Schema$About {
   user: Schema$User
}

export interface Schema$User {
   displayName?: string | null;
   emailAddress?: string | null;
   kind?: string | null;
   me?: boolean | null;
   permissionId?: string | null;
   photoLink?: string | null;
}
export interface Schema$File {
   appProperties?: {
      [key: string]: string;
   } | null;
   capabilities?: {
      canAcceptOwnership?: boolean;
      canAddChildren?: boolean;
      canAddFolderFromAnotherDrive?: boolean;
      canAddMyDriveParent?: boolean;
      canChangeCopyRequiresWriterPermission?: boolean;
      canChangeSecurityUpdateEnabled?: boolean;
      canChangeViewersCanCopyContent?: boolean;
      canComment?: boolean;
      canCopy?: boolean;
      canDelete?: boolean;
      canDeleteChildren?: boolean;
      canDownload?: boolean;
      canEdit?: boolean;
      canListChildren?: boolean;
      canModifyContent?: boolean;
      canModifyContentRestriction?: boolean;
      canMoveChildrenOutOfDrive?: boolean;
      canMoveChildrenOutOfTeamDrive?: boolean;
      canMoveChildrenWithinDrive?: boolean;
      canMoveChildrenWithinTeamDrive?: boolean;
      canMoveItemIntoTeamDrive?: boolean;
      canMoveItemOutOfDrive?: boolean;
      canMoveItemOutOfTeamDrive?: boolean;
      canMoveItemWithinDrive?: boolean;
      canMoveItemWithinTeamDrive?: boolean;
      canMoveTeamDriveItem?: boolean;
      canReadDrive?: boolean;
      canReadRevisions?: boolean;
      canReadTeamDrive?: boolean;
      canRemoveChildren?: boolean;
      canRemoveMyDriveParent?: boolean;
      canRename?: boolean;
      canShare?: boolean;
      canTrash?: boolean;
      canTrashChildren?: boolean;
      canUntrash?: boolean;
   } | null;
   contentHints?: {
      indexableText?: string;
      thumbnail?: {
         image?: string;
         mimeType?: string;
      };
   } | null;
   contentRestrictions?: any[];
   copyRequiresWriterPermission?: boolean | null;
   createdTime?: string | null;
   description?: string | null;
   driveId?: string | null;
   explicitlyTrashed?: boolean | null;
   exportLinks?: {
      [key: string]: string;
   } | null;
   fileExtension?: string | null;
   folderColorRgb?: string | null;
   fullFileExtension?: string | null;
   hasAugmentedPermissions?: boolean | null;
   hasThumbnail?: boolean | null;
   headRevisionId?: string | null;
   iconLink?: string | null;
   id?: string | null;
   imageMediaMetadata?: {
      aperture?: number;
      cameraMake?: string;
      cameraModel?: string;
      colorSpace?: string;
      exposureBias?: number;
      exposureMode?: string;
      exposureTime?: number;
      flashUsed?: boolean;
      focalLength?: number;
      height?: number;
      isoSpeed?: number;
      lens?: string;
      location?: {
         altitude?: number;
         latitude?: number;
         longitude?: number;
      };
      maxApertureValue?: number;
      meteringMode?: string;
      rotation?: number;
      sensor?: string;
      subjectDistance?: number;
      time?: string;
      whiteBalance?: string;
      width?: number;
   } | null;
   isAppAuthorized?: boolean | null;
   kind?: string | null;
   lastModifyingUser?: Schema$User;
   linkShareMetadata?: {
      securityUpdateEligible?: boolean;
      securityUpdateEnabled?: boolean;
   } | null;
   md5Checksum?: string | null;
   mimeType?: string | null;
   modifiedByMe?: boolean | null;
   modifiedByMeTime?: string | null;
   modifiedTime?: string | null;
   name?: string | null;
   originalFilename?: string | null;
   ownedByMe?: boolean | null;
   owners?: Schema$User[];
   parents?: string[] | null;
   permissionIds?: string[] | null;
   permissions?: any[];
   properties?: {
      [key: string]: string;
   } | null;
   quotaBytesUsed?: string | null;
   resourceKey?: string | null;
   shared?: boolean | null;
   sharedWithMeTime?: string | null;
   sharingUser?: Schema$User;
   shortcutDetails?: {
      targetId?: string;
      targetMimeType?: string;
      targetResourceKey?: string;
   } | null;
   size?: string | null;
   spaces?: string[] | null;
   starred?: boolean | null;
   teamDriveId?: string | null;
   thumbnailLink?: string | null;
   thumbnailVersion?: string | null;
   trashed?: boolean | null;
   trashedTime?: string | null;
   trashingUser?: Schema$User;
   version?: string | null;
   videoMediaMetadata?: {
      durationMillis?: string;
      height?: number;
      width?: number;
   } | null;
   viewedByMe?: boolean | null;
   viewedByMeTime?: string | null;
   viewersCanCopyContent?: boolean | null;
   webContentLink?: string | null;
   webViewLink?: string | null;
   writersCanShare?: boolean | null;
}

export interface Schema$Comment {
   anchor?: string | null;
   author?: Schema$User;
   content?: string | null;
   createdTime?: string | null;
   deleted?: boolean | null;
   htmlContent?: string | null;
   id?: string | null;
   kind?: string | null;
   modifiedTime?: string | null;
   quotedFileContent?: {
      mimeType?: string;
      value?: string;
   } | null;
   replies?: Schema$Reply[];
   resolved?: boolean | null;
}

export interface Schema$Reply {
   action?: string | null;
   author?: Schema$User;
   content?: string | null;
   createdTime?: string | null;
   deleted?: boolean | null;
   htmlContent?: string | null;
   id?: string | null;
   kind?: string | null;
   modifiedTime?: string | null;
}

export interface Schema$CommentList {
   comments?: Schema$Comment[];
   kind?: string | null;
   nextPageToken?: string | null;
}

export interface Schema$Channel {
   address?: string | null;
   expiration?: string | null;
   id?: string | null;
   kind?: string | null;
   params?: {
      [key: string]: string;
   } | null;
   payload?: boolean | null;
   resourceId?: string | null;
   resourceUri?: string | null;
   token?: string | null;
   type?: string | null;
}
export interface Change {
   changeType?: string | null;
   drive?: any; //Schema$Drive;
   driveId?: string | null;
   file?: Schema$File;
   fileId?: string | null;
   kind?: string | null;
   removed?: boolean | null;
   teamDrive?: any;//Schema$TeamDrive;
   teamDriveId?: string | null;
   time?: string | null;
   type?: string | null;
}
export interface ChangeList {
   changes?: Change[];
   kind?: string | null;
   newStartPageToken?: string | null;
   nextPageToken?: string | null;
}


export interface ChannelWatchHeaders {
   Accept: string,
   'Accept-Encoding': string,
   'Content-Length': string,
   'Mattermost-Session-Id': string,
   'User-Agent': string,
   'X-Forwarded-For': string,
   'X-Forwarded-Proto': string,
   'X-Goog-Channel-Expiration': string,
   'X-Goog-Channel-Id': string,
   'X-Goog-Message-Number': string,
   'X-Goog-Resource-Id': string,
   'X-Goog-Resource-State': string,
   'X-Goog-Resource-Uri': string,
}