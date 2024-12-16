import moment from "moment";
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

export const DrivingLicenseSchema = Yup.object({
  expiry_date: Yup.date()
    .min(
      moment().subtract(1, "days"),
      "Expire date should not be before today's date"
    )
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Expiry Date Is Required"),
  number: Yup.string()
    .trim()
    .min(15, "The Driving License no must be 15 characters")
    .max(15, "The Driving License no must be 15 characters")
    .required("Driving license number required"),
  file: Yup.mixed()
    .required("File Is Required")
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
  name: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .required("Name Is Required"),
});
