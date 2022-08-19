export type GoogleToken = {
   access_token?: string | null | undefined,
   scope?: string | undefined,
   token_type?: string | null | undefined,
   expiry_date?: number | null | undefined,
   refresh_token?: string | null | undefined,
}

export type GoogleTokenResponse = {
   tokens: GoogleToken,
   res: any
}