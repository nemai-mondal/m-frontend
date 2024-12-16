import * as Yup from "yup";
const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  // "image/jpg",
  // "image/jpeg",
  // "image/png",
];
export const EmployeeQualificationSchema = Yup.object({
  stream_type: Yup.object().required("Stream Is Required"),
  qualification: Yup.object().required('Qualification Is Required'),
  qualification_course_type: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  specialization: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .required("Specialization Is Required"),
  institute_name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .required("Institute Name Is Required"),
  university_name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .required("University Name Is Required"),
  percentage: Yup.number()
    .min(1, "Percentage must be grater than or equal 1")
    .max(100, "Percentage must be less than or equal 100")

    .required("Percentage Is Required"),
  grade: Yup.object().nullable(),
  duration_of_course: Yup.number()
    .min(1, "Duration must be between 1 to 10")
    .max(10, "Duration must be between 1 to 10")

    .nullable(),
  year: Yup.number().nullable(),
  nature_of_course: Yup.object().nullable(),
  qualification_status: Yup.object().nullable(),
  from_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  to_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  date_of_passing: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  remarks: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  file: Yup.mixed()
    .nullable()
    .test(
      "Fichier taille",
      "File should not be more than 1gb",
      function (value) {
        const { size } = this.parent.file || {};
        return !size || (size && size <= 1024 * 1024 * 1024);
      }
    )
    .test(
      "format",
      "'DOC', 'XLSX', 'XLS', 'PDF' Supported",
      function (value) {
        const { type } = this.parent.file || {};
        return !this.parent?.file?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
});
