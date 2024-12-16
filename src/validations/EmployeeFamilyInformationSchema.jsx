import * as Yup from "yup";
const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png",
];
export const EmployeeFamilyInformationSchema = Yup.object({
  title: Yup.object().nullable(),
  name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .required("Name Is Required"),
  gender: Yup.object().required("Gender Is Required"),
  relation: Yup.object().required("Relation Is Required"),
  address: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .required("Address Is Required"),
  blood_group: Yup.object().nullable(),
  marital_status: Yup.object().nullable(),
  marriage_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  employment: Yup.object().nullable(),
  proffesion: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  nationality: Yup.object().required("Nationality Is Required"),
  insurance_name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  remarks: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  is_depend: Yup.boolean().nullable(),
  health_insurance: Yup.boolean().nullable(),
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
      "Upload correct file type 'DOC', 'XLSX', 'XLS', 'PDF' ,'JPG','JPEG','PNG'",
      function (value) {
        const { type } = this.parent.file || {};
        return !this.parent?.file?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
  date_of_birth: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Age must be at least 18 years old"
    )
    .nullable(),
  contact_number: Yup.string()
    .trim()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .required("Contact Number Is Required"),
});
