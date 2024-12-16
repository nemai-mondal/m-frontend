import * as Yup from "yup";
const SUPPORTED_FORMATS = ["application/msword", "application/pdf"];
export const CandidateInformationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .required("Name Required"),
  email: Yup.string()
    .email()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .required("Email Required"),
  phone: Yup.string()
    .trim()
    .max(20, "Character must be less than or equal 20")
    .required("Contact Required"),
  applied_designation_id: Yup.object().required("Designation Required"),
  applied_department_id: Yup.object().required("Department Required"),
  file: Yup.mixed()
    .nullable()
    .test(
      "Fichier taille",
      "File should not be more than 5mb",
      function (value) {
        const { size } = this.parent.file || {};
        return !size || (size && size <= 1024 * 1024 * 5);
      }
    )
    .test(
      "format",
      "Upload correct file type 'DOC' and 'PDF' ",
      function (value) {
        const { type } = this.parent.file || {};
        return !this.parent?.file?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
  source_name: Yup.object().required("Source Required"),
  source_link: Yup.string()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .nullable(),
  total_experience: Yup.string()
    .trim()
    .max(20, "Character must be less than or equal 20")
    .nullable(),
  previous_designation: Yup.string()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .required("Job Profile Required"),
  previous_company: Yup.string()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .nullable(),
  current_company: Yup.string()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .nullable(),
  current_ctc: Yup.string()
    .trim()
    .max(40, "Character must be less than or equal 40")
    .nullable(),
  expected_ctc: Yup.string()
    .trim()
    .max(40, "Character must be less than or equal 40")
    .required("Expected CTC Required"),
  highest_qualification: Yup.string()
    .trim()
    .max(40, "Character must be less than or equal 40")
    .required("Highest Qualification Required"),
  notice_period: Yup.string()
    .trim()
    .max(40, "Character must be less than or equal 40")
    .nullable(),
  primary_skill: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .required("Primary Skill Required"),
  secondary_skill: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .nullable(),
  remarks: Yup.string()
    .trim()
    .max(500, "Character must be less than or equal 500")
    .nullable(),
  // applied_designation_id
  interview_id: Yup.number().nullable(),
  status: Yup.object().nullable(),
  feedback_remarks: Yup.string()
    .trim()
    .max(1000, "Character must be less than or equal 1000")
    .nullable(),
  attitude: Yup.object().nullable(),
  is_suitable: Yup.object().nullable(),
  work_exp_assessment: Yup.string()
    .trim()
    .max(40, "Character must be less than or equal 40")
    .nullable(),
  interpersonal_skill_score: Yup.object().nullable(),
  communication_skill_score: Yup.object().nullable(),
});
