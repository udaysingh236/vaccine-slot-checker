# vaccine-slot-checker
Covid 19 vaccination slot checker. checks the availability of the next four days for a given Pincode every 5 minutes and will send an email notification as soon as a slot becomes available. :smile: :smile:
The application fetches Pincodes and email addresses from a google sheet which is associated with a google form.

Here is the link to register: [https://www.weeklytechy.com/p/covid-19-india-vaccination-slot-checker.html](https://www.weeklytechy.com/p/covid-19-india-vaccination-slot-checker.html)

## Work Flow
The application fetches Pincodes and email addresses from a google sheet which is associated with a google form. 
The google form is associated with your Google account. 

It will checks the availability of the next four days for a given Pincode every 5 minutes and will send an email notification as soon as a slot becomes available

crontab is used to trigger the application every 5 mins.
cron signature:
```
*/5 * * * *
```


## Installation

### Clone the Repository
```
git clone https://github.com/udaysingh236/vaccine-slot-checker.git
```

Google sheet API credentials need to be generated to run the application.
All the information for the same is available at [https://developers.google.com/sheets/api/quickstart/nodejs](https://developers.google.com/sheets/api/quickstart/nodejs)

With help of the above link, you will be able to generate a token.json file.

Provide all the necessary env variables in the .env file. After that run the below commands

```
npm install --save
node app.js
````

## Contributing

I love your input! and want to make your contribution to this project easy and transparent, whether it's:
- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

Made with love in INDIA :india: 