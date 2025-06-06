export interface RequestToken {
	status_message: string;
	request_token: string;
	success: boolean;
	status_code: number;
}

export interface AccessToken {
	success: boolean;
	status_code: number;
	status_message: string;
	account_id: string;
	access_token: string;
}
