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