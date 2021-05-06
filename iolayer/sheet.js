const fs = require('fs').promises;
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const credContent = {
    client_secret: process.env.CLIENT_SECRET,
    client_id: process.env.client_id,
    redirect_uris: process.env.REDIRECT_URIS.split(' ')
}

exports.getDataFromGoogleSheet = async () => {
    try {
        const pincodes = [];
        const pinToEmail = {};
        const userDetails = {};
        const {client_secret, client_id, redirect_uris} = credContent;

        // * Create an OAuth2 client with the given credentials
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        const tokenContent = await fs.readFile(TOKEN_PATH).catch((error) => {
            if (error.code === 'ENOENT') {
                console.log('Token File not found! Create it');
                throw error;
            } else {
                throw error;
            }
        });
        oAuth2Client.setCredentials(JSON.parse(tokenContent));
        const sheets = google.sheets('v4');
        const sheetData = await sheets.spreadsheets.values.get({
            auth: oAuth2Client,
            spreadsheetId: process.env.SPREADSHEETID,
            range: process.env.RANGE});
        const rows = sheetData.data.values;
        if (rows.length) {
            rows.map((row) => {
                if (pincodes.indexOf(row[3]) !== -1) {
                  if (pinToEmail[row[3]].indexOf(row[0]) === -1 && row[1].toUpperCase() === "YES") {
                    pinToEmail[row[3]].push(row[0]);
                    userDetails[row[0]] = [row[0], row[2], row[4], row[6]]
                  } else if (pinToEmail[row[3]].indexOf(row[0]) !== -1 && row[1].toUpperCase() === "NO") {
                    pinToEmail[row[3]].splice(pinToEmail[row[3]].indexOf(row[0]), 1);
                  }
                } else {
                  if (row[1].toUpperCase() === "YES") {
                    pincodes.push(row[3]);
                    pinToEmail[row[3]] = [row[0]]
                    userDetails[row[0]] = [row[0], row[2], row[4], row[6]]
                  }
                }
            }) 
        } else {
            console.log('No data found.');
        }
        return {pincodes, pinToEmail, userDetails };
    } catch (error) {
        console.log(`Error in getDataFromGoogleSheet, error is: ${error}`);
        throw error;
    }

}