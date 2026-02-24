function convertTimestamp(timestamp) {
    var myDate = new Date(timestamp);

    return myDate.toLocaleString();
}

export default convertTimestamp;
