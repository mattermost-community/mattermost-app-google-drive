
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
   fileComment?: any;
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
      subtype?: string | null;
   },
   suggestion?: {
      subtype?: string | null;
   }
}

export interface GA$Assignment {
   assignedUser?: GA$User;
   subtype?: string | null;
}