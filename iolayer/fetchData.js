const axios = require('axios');
const pinDateSlotsUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode`
const config = {
  method: 'get',
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  }
};

exports.fetchPinData = async (fetchDate, pincode) => {
    try {
        config.url = `${pinDateSlotsUrl}=${pincode}&date=${fetchDate}`;
        let response = await axios(config);
        return response.data;
    } catch (error) {
        console.log(`Error in fetchPinData ${fetchDate}, ${pincode}, error is: ${error}`);
    }
}



