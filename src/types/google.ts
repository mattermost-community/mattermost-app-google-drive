export type GoogleToken = {
   access_token: string,
   scope: string,
   token_type: string,
   expiry_date: number
}

export type GoogleTokenResponse = {
   tokens: GoogleToken,
   res: any
}