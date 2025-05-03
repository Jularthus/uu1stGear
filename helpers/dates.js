function formatUnixDate(unixSeconds) {
  const date = new Date(unixSeconds * 1000); // convert to milliseconds
  const day = String(date.getDate()).padStart(2, "0"); // to get the 0 if day < 10
  const month = String(date.getMonth() + 1).padStart(2, "0"); // to get the 0 if month < 10
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports.formatUnixDate = formatUnixDate;
