getTime = function(){
  let msgTime =  new Date()
  let hours = msgTime.getHours();
  let minutes = msgTime.getMinutes();
  let seconds = msgTime.getSeconds();
  return `${hours}:${minutes}:${seconds}`;
}

let generateMessage = (from, text) => {
  return {
    from,
    text,
    sendedAt: getTime()
  }
}

module.exports = {generateMessage}
