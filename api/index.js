const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port =  process.env.PORT ||3000;
const knex = require('./db/knex');

app.use(bodyParser.json());
app.use(express.static('./../web'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../web/index.html'));
  //__dirname : It will resolve to your project folder.
});
app.get('/getCounts', async (req, res) => {
  let {dateTime} = req.query;
  let query = knex('partner').count('* as count')
  if(dateTime != undefined && dateTime != '' && dateTime != null){
    query.where('request_datetime', 'like', '%'+ dateTime+ '%')
  }
  query.then(function (result) {
    let query2 = knex('partner').select('partner_id as id').count('* as count').groupBy('partner_id')
    if(dateTime != undefined && dateTime != '' && dateTime != null){
      query2.where('request_datetime', 'like', '%'+ dateTime+ '%')
    }
    let data = {
      totalCount: 0,
      totalPartner1Count: 0,
      totalPartner2Count: 0,
    }
    if(result.length > 0){
      data.totalCount = result[0].count
    }
    query2.then(function (result2) {      
      if(result2.length > 0){
        result2.map(obj => {
          if(obj.id === 1){
            data.totalPartner1Count = obj.count;
          } else {
            data.totalPartner2Count = obj.count;
          }
        })
      }
      res.json({
      success: true,
      message: 'Your request has been processed',
      data
    });  
    })
    
  }).catch(function (error) {
    res.json({
      success: false,
      message: 'Something went wrong'
    });
  });
  // res.json({'data':{
  //   'Basic Salary' : basicSalaryAmount,
  //   'Overtime' : totalOverTimeAmount,
  //   'Bonus' :bonusAmount,
  //   'Total Salary(Male)' :maleTotal,
  //   'Total Salary(Female)' :femaleTotal,
  //   'Total Salary' :totalSalary,
  // }});
})

app.get('/pingServerByPartners', (req,res) => {
  console.log(req.query);
  let {id} = req.query;
  console.log('id : ',id);
  if(id != 1 && id !=2) {
    let response = {'success': false,'msg':'This is not valid partner id'};
    if(id === undefined) 
      response.msg = 'partner does not exist, please share your partner id';
    res.json(response);
  }
  else {
    knex('partner').insert({partner_id: id}).then(function (result) {
      res.json({
        success: true,
        message: 'Your request has been processed'
      });
    }).catch(function (error) {
      res.json({
        success: false,
        message: 'Something went wrong'
      });
    });
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})