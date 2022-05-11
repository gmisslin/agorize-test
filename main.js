var startDate = new Date(2016,6,1,10,30); // July 1st, 10:30
var endDate = new Date(2016,6,1,14,00); // July 1st, 14:00

new Event(true, true, startDate, endDate); // weekly recurring opening in calendar


//ADD MORE EVENTS TO TEST
// var startDate = new Date(2016,6,5,10,30); // July 5th, 10:30
// var endDate = new Date(2016,6,5,14,00); // July 5th, 14:00
// new Event(true, false, startDate, endDate); // single opening in calendar

// var startDate = new Date(2016,6,9,10,30); // July 9th, 10:30
// var endDate = new Date(2016,6,9,14,00); // July 9th, 14:00
// new Event(true, false, startDate, endDate); // single opening in calendar

// startDate = new Date(2016,6,5,13,00); // July 5th 11:30
// endDate = new Date(2016,6,5,14,00); // July 5th 12:30
// new Event(false, false, startDate, endDate); // intervention scheduled

startDate = new Date(2016,6,8,11,30); // July 8th 11:30
endDate = new Date(2016,6,8,12,30); // July 8th 12:30
new Event(false, false, startDate, endDate); // intervention scheduled



var fromDate = new Date(2016,6,4,10,00);
var toDate = new Date(2016,6,10,10,00);

//get the list of availabilities dates
const availabilities = Event.prototype.availabilities(fromDate, toDate);

let text = "";
if(availabilities.length) {
    //Construction of the log message
    availabilities.forEach(function(availability,index){
        if(index === 0) {
            text += "I'm available from "+availability.toFormat('MMMM dd')+", at "
        }
        
        if(availabilities[index+1] && availabilities[index+1].day === availability.day && availabilities[index+2] &&  availabilities[index+2].day === availabilities[index+1].day){
            text += availability.toFormat('HH:mm') + ", ";
        }
        else if(availabilities[index+2] && availabilities[index+2].day === availabilities[index+1].day){
            text += availability.toFormat('HH:mm') + " ";
        }
        else if(availabilities[index+2] && availabilities[index+2].day !== availabilities[index+1].day){
            text += availability.toFormat('HH:mm') + " and ";
        }
        else if(!availabilities[index+2] && availabilities[index+1]){
            text += availability.toFormat('HH:mm') + " and ";
        }
        else if(!availabilities[index+1]){
            text += availability.toFormat('HH:mm');
        }

        if(availabilities[index+1] && availabilities[index+1].day !== availability.day)
        {
            text += "\nI'm also available from "+availabilities[index+1].toFormat('MMMM dd')+", at ";
        }
    });
    text += "\nI'm not available any other time !";
}
else{
    text = "I don't have any availability!"
}

console.log(text)

/*
 * Answer should be : 
 * I'm available from July 8th, at 10:30, 11:00, 12:30, 13:00, and 13:30
 * I'm not available any other time !
 */