import * as Yup from "yup";

export const ProjectSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(1000, "Project Name can be maximum 100 character")
    .required(" Project Name Required"),
  client_id: Yup.object().required("Select Client Name"),
  technologies: Yup.array()
    .min(1, "Select Technologies")
    .required("Select Technologies"),
  resources: Yup.array()
    .min(1, "Select Resources")
    .required("Select Resources"),
  start_date: Yup.date().required("Start Date is required"),
  duration: Yup.number().max(500000).required("Duration Required"),
});
