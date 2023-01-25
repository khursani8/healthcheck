
function getDate(){
    const date_ob = new Date()
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    return `${date}_${month}_${year}`
}

function getTime() {
  const date_ob = new Date();
  let hour = ("0" + date_ob.getHours()).slice(-2);
  let min = ("0" + date_ob.getMinutes()).slice(-2);
  let sec = ("0" + date_ob.getSeconds()).slice(-2);
  return `${hour}H ${min}M ${sec}s`;
}

module.exports = {
  getDate,
  getTime,
};