import * as Yup from "yup";

export const HrActivities = Yup.object({
  step: Yup.string().required("Step is required"),
  name: Yup.string()
    .max(80, "Name must be less than or equal to 80 characters")
    .required("Title required"),
  client_id: Yup.object().required("Client is required"),
  manager_id: Yup.object().required("Manager is required"),
  start_date: Yup.date().required("Start Time required"),
  end_date: Yup.date()
    .min(Yup.ref("start_date"), "End time must be after start time")
    .test("not-same", "End time must be after start time", function (value) {
      const start_time = this.resolve(Yup.ref("start_date"));
      return value && start_time && value.getTime() !== start_time.getTime();
    })
    .required("End Time required"),
  project_type: Yup.object().required("Project Type is Required"),
  project_status: Yup.object().required("Level is Required"),
  priority: Yup.object().required("Project Type is Required"),
  experience: Yup.string()
    .max(80, "Description must be less than or equal to 80 characters")
    .required("Experience Required"),
  salary_range: Yup.string()
    .max(80, "Salary Range must be less than or equal to 80 characters")
    .required("Salary Range is required"),
  no_of_openings: Yup.string()
    .max(40, "Number Openings must be less than or equal to 40 characters")
    .required("No of Openings is required"),
  notice_period: Yup.object().required("Notice Period is required"),
  description: Yup.string().required("Description required"),
});
