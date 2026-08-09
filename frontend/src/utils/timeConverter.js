
const convertTime = (total_seconds)=>{
    const seconds = Math.ceil(total_seconds) % 60;
    total_seconds -= seconds;
    const minutes = Math.ceil(total_seconds/60) % 60;
    total_seconds -= minutes*60;
    const hours = Math.ceil(total_seconds/60/60);
    let result = ""
    if (hours >= 1)
        result += `${hours}h `
    if (minutes >= 1)
        result += `${minutes}m `
    if(seconds >= 1)
        result += `${seconds}s `

    return result
}

export default convertTime;