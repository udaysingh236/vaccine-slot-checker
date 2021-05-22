'use strict';
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
                    let emailPayload = [];
                    slotsData[slotIndex]["centers"].forEach(sessionData => {
                        sessionData["sessions"].forEach(sessionInfo => {
                            if (sessionInfo.min_age_limit < 45  && sessionInfo.available_capacity > 0 
                                                                && sessionInfo.available_capacity_dose1 > 0) {
                                emailPayload.push({
                                    centerName: sessionData.name,
                                    address: sessionData.address,
                                    district_name: sessionData.district_name,
                                    state_name: sessionData.state_name,
                                    pincode: sessionData.pincode,
                                    date: sessionInfo.date,
                                    available_capacity: sessionInfo.available_capacity
                                });
                            }
                        })
                    });
                    if (emailPayload.length) {
                        // Send email right now, dont wait
                        console.log("Going to send mail to : " + JSON.stringify(pinToEmail[pincodeArray[pinIndex]]));
                        notify.sendEmails(emailPayload, pinToEmail[pincodeArray[pinIndex]], userDetails);
                    }
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