// Ambuj Dubey
$( document ).ready(function() {
 
  fetchData = (date) => {
    fetch(`/getCounts?dateTime=${date}`)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function({data}) {
          setTimeout(()=>{
            updateTableValues(data);
          },250);
        });
      }
    ).catch(function(err) {
      console.log('Fetch Error :-S', err);
    })  
  };  

  applyFilter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    $('.tableArea').html('<span style="color: green">Please wait for result...............<span>');
    fetchData(moment($('#datetime').val()).format('YYYY-MM-DD HH:mm'));
  }

  updateTableValues = (data) => {
    $('.tableArea').html(`<table>
        <tr>
          <th>Total requests</th>
          <th>Partner 1 Total Request</th>
          <th>Partner 2 Total Request</th>
        </tr>
        <tr>
          <td>${data.totalCount || 0}</td>
          <td>${data.totalPartner1Count || 0}</td>
          <td>${data.totalPartner2Count || 0}</td>
        </tr>
      </table>  
     `);
  }

  fetchData('');

});