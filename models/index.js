const iolayer = require("../iolayer/fetchData");
const notify = require("../utility/sendMail");

exports.checkAvailibility = async (dateArray, pincodeArray, pinToEmail, userDetails) => {
try {
    for (let pinIndex = 0; pinIndex < pincodeArray.length; pinIndex++) {
        try {
            const promiseArray = [];
            for (let dateIndex = 0; dateIndex < dateArray.length; dateIndex++) {
                promiseArray.push(iolayer.fetchPinData(dateArray[dateIndex], pincodeArray[pinIndex]))
            }
            let slotsData = await Promise.all(promiseArray).catch((error) => {
                console.log(`Error in checkAvailibility loop, error is: ${error}`);
            });
            // console.log(JSON.stringify(slotsData, null, 2));
            for (let slotIndex = 0; slotIndex < slotsData.length; slotIndex++) {
                if (typeof slotsData[slotIndex] !== 'undefined' ) {
                    console.log(`Found Data for Api: ${pincodeArray[pinIndex]}`);
                    slotsData[slotIndex]["centers"].forEach(sessionData => {
                        sessionData["sessions"].forEach(sessionInfo => {
                            if (sessionInfo.min_age_limit < 45 && sessionInfo.available_capacity > 0) {
                                // Send email right now, dont wait
                                console.log("Going to send mail to : " + JSON.stringify(pinToEmail[pincodeArray[pinIndex]]));
                                notify.sendEmails(sessionInfo, sessionData, pinToEmail[pincodeArray[pinIndex]], userDetails);
                            }
                        })
                    });
                }
            }
        } catch (error) {
            console.log(`Error in checkAvailibility first loop, error is: ${error}`);
        }
    }
} catch (error) {
    console.log(`Error in checkAvailibility, error is: ${error}`);
}
}