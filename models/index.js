const iolayer = require("../iolayer/fetchData");
const { error } = require("console");
const availableCapacity = [];
exports.checkAvailibility = async (dateArray, pincodeArray, pinToEmail) => {
try {
    for (let pinIndex = 0; pinIndex < pincodeArray.length; pinIndex++) {
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
                // console.log(JSON.stringify(slotsData[slotIndex], null, 2));
                slotsData[slotIndex]["centers"].forEach(sessionData => {
                    sessionData["sessions"].forEach(sessionInfo => {
                        if (sessionInfo.min_age_limit < 45 && sessionInfo.available_capacity == 0) {
                            // Send email right now, dont wait
                            console.log(sessionData);
                        }
                    })
                });
            }
        }
    }
} catch (error) {
    console.log(`Error in checkAvailibility, error is: ${error}`);
}
}