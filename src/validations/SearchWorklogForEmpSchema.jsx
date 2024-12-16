import * as Yup from "yup";

export const SearchWorklogForEmpSchema = Yup.object({
  start_date: Yup.date(),
  end_date: Yup.date()
  .when('start_date', (start_date,schema) => {
      if (start_date) {
          return schema
              .min(start_date, 'End Date must be after Start Date')
            //   .typeError('End Date is required')
      }
  }),
});
