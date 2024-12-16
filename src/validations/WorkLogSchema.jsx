import * as Yup from "yup";

/**
 * Validates the format of the time spent string.
 * Format: 2w 4d 6h 45m
 */
function checkTimespanFormat(timespanStr) {
  // timespan items must be separated by 1 space
  timespanStr = timespanStr.toLowerCase().split(" ");
  // timespan items must be formatted correctly
  // const validStr = timespanStr.filter((item) => /^\d{1,2}[wdhm]$/.test(item));
  // return timespanStr.length === validStr.length;
  const validStr = timespanStr.filter((item) => /^\d+[wdhm]$/.test(item));
  return timespanStr.length === validStr.length;
}

/**
 * Validates the order of time keys.
 */
function checkTimespanKeysOrder(timespanStr) {
  const ORDER = ["w", "d", "h", "m"];

  let timeKeysOrder = timespanStr
    .replace(/[^wdhm]/g, "") // Removing non time keys characters
    .split("") // toArray
    .map((char) => {
      return ORDER.indexOf(char); // Getting the order of time keys
    });

  for (var i = 0; i < timeKeysOrder.length - 1; i++)
    if (timeKeysOrder.at(i) >= timeKeysOrder.at(i + 1)) return false;
  return true;
}

// Custom validation function for time_spent field
const timeSpentValidation = (value) => {
  if (!checkTimespanFormat(value) || !checkTimespanKeysOrder(value)) {
    return false;
  }
  return true;
};

export const WorkLogSchema = Yup.object({
  activity_id: Yup.object().required("Activity Required"),
  project_id: Yup.object().required("Project Required"),
  client_id: Yup.object().required("Client Required"),
  date: Yup.date()
    .max(new Date(), "Dates beyond today are not allowed")
    .required("Date Required"),
  time_spent: Yup.string()
    .test(
      "timeFormat",
      "Invalid time format. Use the format: 2w 4d 6h 45m",
      timeSpentValidation
    )
    .required("Spend Hours Required"),
  description: Yup.string().nullable(),
  task_url: Yup.string()
    .max(500, "Character must be equal or less that 500")
    .nullable(),
});
