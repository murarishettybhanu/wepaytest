const axios = require('axios');

axios.get('https://joloapi.com/api/v1/recharge.php?userid=wepays&key=199806557641007&operator=JO&service=9553911455&amount=10&orderid=wepay123')
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });