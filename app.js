require('dotenv').config();
const model = require("./models/index")
const formData = require("./iolayer/sheet");
const fs = require('fs').promises;
const os = require("os");

// Its like 100 api calls in 5 mins, 24 * 4(dates) = 96 which is less than 100 
const API_CALLS = 24;  
const hostnameIndex = {
    "vaccine-slot-1": [API_CALLS*0, API_CALLS],
    "vaccine-slot-2": [API_CALLS*1, API_CALLS],
    "vaccine-slot-3": [API_CALLS*2, API_CALLS],
    "vaccine-slot-4": [API_CALLS*3, API_CALLS],
    "vaccine-slot-5": [API_CALLS*4, API_CALLS],
}
let createSevenDate = () => {
    const finalDates = [];
    let currentDate = new Date();
    for (let index = 0; index < 4; index++) {
        let tempDate, tempMonth, tempYear;
        let tempDateArray  = currentDate.toLocaleDateString().toString().split('/');
        if (tempDateArray[1].length === 1) {
            tempDate = `0${tempDateArray[1]}`
        } else {
            tempDate = tempDateArray[1]
        }
        if (tempDateArray[0].length === 1) {
            tempMonth = `0${tempDateArray[0]}`
        } else{
            tempMonth = tempDateArray[0]
        }
        tempYear = tempDateArray[2];
        finalDates.push(`${tempDate}-${tempMonth}-${tempYear}`);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return finalDates;
}

let startApp = async () => {
    try {
        let finalDatesArray = createSevenDate();
        console.log(finalDatesArray);
        let pincodes, pinToEmail, pinBatch;
        const finalData =  await formData.getDataFromGoogleSheet().catch((error) => {
            console.log(`Error in getDataFromGoogleSheet call, Filling from local, ${error}`);
        });
        if (typeof finalData === 'undefined') {
            let content = await fs.readFile('localSheet.json').catch((error) => {
                console.log(`Cannt even read from local, throwing error now, ${error}`);
                throw error;
            });
            const localContent = JSON.parse(content);
            pincodes = localContent.pincodes;
            pinToEmail = localContent.pinToEmail;
            userDetails = localContent.userDetails;
        } else {
            pincodes = finalData.pincodes;
            pinToEmail = finalData.pinToEmail;
            userDetails = finalData.userDetails;
        }
        console.log("pincodes.length " + pincodes.length);
        console.log("pincodes " + pincodes);
        if (pincodes.length > API_CALLS) {
            console.log("Hostname: " + os.hostname);
            if (os.hostname().toLowerCase() in hostnameIndex) {
                pincodes = pincodes.splice(hostnameIndex[os.hostname().toLowerCase()][0], hostnameIndex[os.hostname().toLowerCase()][1])
            } else {
                // In case if servers are less and number of pincodes are high take the last 24 and hit them.
                pincodes = pincodes.splice(pincodes.length - API_CALLS , API_CALLS)
            }
        }

        console.log(`pincodes going: ${pincodes}`);
        let lastEmailLogs = await fs.readFile('lastEmailLogs.json').catch((error) => {
            console.log(`Not able to find local email logs, ${error}`);
        });
        // console.log("lastEmailLogs " + typeof lastEmailLogs);
        if (typeof lastEmailLogs !== 'undefined') {
            lastEmailLogs = JSON.parse(lastEmailLogs);
        }
        let emailLogs = await model.checkAvailibility(finalDatesArray, pincodes, pinToEmail, userDetails, lastEmailLogs)
        let allLocalData = {
            pincodes: pincodes,
            pinToEmail: pinToEmail,
            userDetails: userDetails
        }
        await fs.writeFile('localSheet.json', JSON.stringify(allLocalData));
        await fs.writeFile('lastEmailLogs.json', JSON.stringify(emailLogs));
        // console.log(JSON.stringify(slotData, null, 2));  
    } catch (error) {
        console.log(`Error in startApp, error is: ${error}`);
    }
}

startApp();