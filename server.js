require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const AWS = require('aws-sdk');
AWS.config.apiVersions = {
  forecastqueryservice: '2018-06-26',
};
AWS.config.update({region: 'ap-northeast-1'});

const forecastqueryservice = new AWS.ForecastQueryService();
const FORECAST_ARN = process.env.FORECAST_ARN;


app.use('/forecast', (req, res) => {
  const { startDate, endDate } = req.query

  //StartDate: '2021-02-18T20:00:00',
  //EndDate: '2021-02-25T20:00:00',

  const params = {
    ForecastArn: FORECAST_ARN,
    StartDate: startDate,
    EndDate: endDate,
    Filters: { 'item_id': 'KR' }
  };

  forecastqueryservice.queryForecast(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.status(500).send(err)
      return;
    }
    
    console.log(data);
    res.json(data)
  });
})

app.get('/', (req, res) => res.send('API Service for Forecast COVID-19!'))

const port = 80

app.listen(port, () => console.log(`API Server listening on port ${port}!`))
