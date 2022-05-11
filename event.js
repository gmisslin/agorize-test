
function compareLuxonDates(a, b) {
  return a.toMillis() - b.toMillis()
}
var DateTime = luxon.DateTime;

var eventList = [];

var Event = function(opening, recurring, startDate, endDate){
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;

  eventList.push(this);
};

//Get all availabilities according to the opening events and taken interventions
Event.prototype.availabilities = function(fromDate, toDate){
  let fromDateLuxon = DateTime.fromISO(fromDate.toISOString());
  let toDateLuxon = DateTime.fromISO(toDate.toISOString());
 
  const openings = eventList.filter((item) => {
    return item.opening;
  })

  const interventions  = eventList.filter((item) => {
    return !item.opening;
  })

  let availabilities = [];

  //Fill availabilities until toDate 
  openings.forEach((opening) => {
    let openingFromDate = DateTime.fromISO(opening.startDate.toISOString());
    let openingEndDate = DateTime.fromISO(opening.endDate.toISOString());
    let weekDayOfRecurringEvent = openingFromDate.weekday;

    //Fill recuring openings
    if(opening.recurring && openingFromDate <= fromDateLuxon){
      let date1 = fromDateLuxon;
      let date2 = toDateLuxon;
      
      while(date1 <= date2){
        if(weekDayOfRecurringEvent === date1.weekday){
          openingFromDateRecurring = openingFromDate.set({ day: date1.day })
          openingEndDateRecurring = openingEndDate.set({ day: date1.day })
          while ( openingFromDateRecurring < openingEndDateRecurring ) {
            availabilities.push(openingFromDateRecurring)
            openingFromDateRecurring = openingFromDateRecurring.plus({ minutes: 30 });
          }
        }
        date1 = date1.plus({ days: 1 });
      }  
    }
    //Fill single openings
    else if(!opening.recurring && openingFromDate >= fromDateLuxon && openingEndDate <= toDateLuxon){
      while ( openingFromDate < openingEndDate ) {
        availabilities.push(openingFromDate)
        openingFromDate = openingFromDate.plus({ minutes: 30 });
      }
    }
  });

  availabilities.sort(compareLuxonDates)

  //Compare availabilities with interventions and remove items from availabilities
  interventions.forEach((intervention) => {
    let interventionFromDate = DateTime.fromISO(intervention.startDate.toISOString());
    let interventionEndDate = DateTime.fromISO(intervention.endDate.toISOString());
    if(interventionFromDate >= fromDateLuxon && interventionEndDate <= toDateLuxon){
      while (interventionFromDate < interventionEndDate) {
        availabilities.forEach((availability,index) => {
          if(interventionFromDate.valueOf() === availability.valueOf()){
            availabilities.splice(index, 1); 
          }
        })
        interventionFromDate = interventionFromDate.plus({ minutes: 30 });
      }
    }    
  });

  return availabilities;
}
