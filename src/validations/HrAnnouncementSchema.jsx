import moment from "moment";
import * as Yup from "yup";

export const HrAnnouncementSchema = Yup.object({
  title: Yup.string().trim()
    .max(150, "Character must be less than or equal 150")
    .required("Title Required"),
  description: Yup.string().trim()
    .max(150, "Character must be less than or equal 150")
    .required("Description Required"),
  event_date: Yup.date()
    .min(
      moment().subtract(1, "days"),
      "Event Date Must Be Today's Date OR After Today's Date"
    )
    .max(new Date("9999-12-31"), "Invalid date")

    .required("Event Date Required"),
  event_start_time: Yup.date().required("Event Start Time Required"),
  event_end_time: Yup.date()
    .min(Yup.ref("event_start_time"), "End time must be after start time")
    .test("not-same", "End time must be after start time", function (value) {
      const start_time = this.resolve(Yup.ref("event_start_time"));
      return value && start_time && value.getTime() !== start_time.getTime();
    })
    .required("Event End Time Required"),
});
