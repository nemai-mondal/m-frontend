/* eslint-disable react/prop-types */
import {
  Box,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
const MultipleResourceFormDev = ({
  departments,
  handleSetData,
  unique_id,
  handleGetData,
  handleDeleteField,
  errors,
  getUser,
  user,
}) => {
  const handleDepartmentChange = (selectedOption) => {
    getUser(selectedOption.value, unique_id);
    handleSetData("department_id", selectedOption, unique_id);
  };
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <InputLabel className="fixlabel">Resource Type<span>*</span></InputLabel>
            <Select
              placeholder="Select Resource Type"
              options={
                handleGetData("department_id", unique_id)
                  ? [...departments, handleGetData("department_id", unique_id)]
                  : departments
              }
              value={handleGetData("department_id", unique_id) || ""}
              onChange={(selectedOption) => {
                handleDepartmentChange(selectedOption);
              }}
              className="basic-multi-select selectTag"
              classNamePrefix="select"
            />
            {errors[unique_id]["department_id"] ? (
              <Typography component="span" className="error-msg">
                {errors[unique_id]["department_id"]}
              </Typography>
            ) : null}
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <FormGroup>
            <InputLabel className="fixlabel">Resource Name<span>*</span></InputLabel>
            <Select
              placeholder="Slect Resource Name"
              options={user}
              isMulti
              value={handleGetData("user_ids", unique_id) || ""}
              onChange={(selectedOption) => {
                handleSetData("user_ids", selectedOption, unique_id);
              }}
              className="basic-multi-select selectTag"
              classNamePrefix="select"
            />
            {errors[unique_id]["user_ids"] ? (
              <Typography component="span" className="error-msg">
                {errors[unique_id]["user_ids"]}
              </Typography>
            ) : null}
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <InputLabel className="fixlabel">Estimation</InputLabel>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Stack
                component={"div"}
                direction={"row"}
                alignItems={"center"}
                className="input-dropdown"
              >
                <input
                  type="text"
                  name="yyy"
                  id=""
                  placeholder="EX- 200/20.5"
                  value={handleGetData("estimation_value", unique_id) || ""}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^\d.]/g, "");
                    if (
                      /^\d{1,10}$/.test(numericValue) ||
                      numericValue === ""
                    ) {
                      handleSetData(
                        "estimation_value",
                        numericValue,
                        unique_id
                      );
                    } else {
                      e.target.value = "";
                    }
                  }}
                />
                <select
                  value={handleGetData("estimation_type", unique_id) || ""}
                  onChange={(e) => {
                    handleSetData("estimation_type", e.target.value, unique_id);
                  }}
                >
                  <option>Hours</option>
                  <option>Day</option>
                </select>
              </Stack>
              {unique_id > 0 ? (
                <IconButton
                  aria-label="Remove"
                  className="round-color"
                  onClick={() => {
                    handleDeleteField(
                      unique_id,
                      handleGetData("department_id", unique_id) || ""
                    );
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : (
                ""
              )}
            </Stack>
          </FormGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultipleResourceFormDev;
