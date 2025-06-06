export interface Token {
	success: boolean;
	expires_at: string;
	request_token: string;
}

export interface Session {
	success: boolean;
	session_id: string;
}
