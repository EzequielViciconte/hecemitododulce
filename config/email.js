require('dotenv').config({ path: 'variables.env' });
module.exports = {
    CLIENT_ID: '667053186947-f82bet5qhhig5huh5vtb5pp5qe27bovc.apps.googleusercontent.com',
    CLIENT_SECRET: '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',
    REDIRECT_URL: 'https://developers.google.com/oauthplayground',
    REFRESH_TOKEN: process.env.REFRESHTOKEN
};