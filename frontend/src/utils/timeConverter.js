
const convertTime = (seconds)=>{
    const hours = seconds/60/60;
    seconds -= hours*60*60;
    const minutes = seconds/60;
    seconds -= minutes*60;
    let result = ""
    if (hours > 0)
        result += `${hours}h `
    if (minutes >0)
        result += `${minutes}m `
    if(seconds > 0)
        result += `${seconds}s `

    return result
}

export default convertTime;