// date.js
import { format } from  "date-fns";

const today = new Date();
const formatted = format(today, 'yyyy/MM/dd HH:mm');


console.log(formatted);


export function currentTime() {

  const timeDiv = document.createElement('div');
  timeDiv.classList.add('current-time');
  timeDiv.textContent = `${formatted}`
  return timeDiv;

}