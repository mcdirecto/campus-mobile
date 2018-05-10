const AppSettings = require('../AppSettings')

const SSO_CREDENTIALS_ERROR = 'orchestration failed(Error: IDP returned status was not success)'

const ssoService = {
	retrieveAccessToken(loginInfo) {
		return fetch(AppSettings.AUTH_SERVICE_API_URL, {
			method: 'POST',
			headers: {
				'Authorization': loginInfo,
				'x-api-key': 'AUTH_SERVICE_API_KEY_PH'
			}
		})
			.then(response => (response.json()))
			.then((data) => {
				if (data.errorMessage) {
					throw (data.errorMessage)
				} else {
					if (data.access_token && data.expiration) {
						return data
					} else {
						throw new Error('Invalid response from server.')
					}
				}
			})
			.catch((err) => {
				switch (err) {
					case SSO_CREDENTIALS_ERROR: {
						throw new Error('There was a problem with your credentials.')
					}
					default: {
						console.log(err)
						throw new Error('There was a problem signing in. Please try again later.')
					}
				}
			})
	}
}

export default ssoService
