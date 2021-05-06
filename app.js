require('dotenv').config();
const model = require("./models/index")
const formData = require("./iolayer/sheet");
const fs = require('fs').promises;
let createSevenDate = () => {
    const finalDates = [];
    let currentDate = new Date();
    for (let index = 0; index < 7; index++) {
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
        let pincodes, pinToEmail;
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
        await model.checkAvailibility(finalDatesArray, pincodes, pinToEmail, userDetails)
        let allLocalData = {
            pincodes: pincodes,
            pinToEmail: pinToEmail,
            userDetails: userDetails
        }
        await fs.writeFile('localSheet.json', JSON.stringify(allLocalData));
        // console.log(JSON.stringify(slotData, null, 2));  
    } catch (error) {
        console.log(`Error in startApp, error is: ${error}`);
    }
}

startApp();