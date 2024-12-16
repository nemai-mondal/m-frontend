import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  InputLabel,
  TextField,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Skeleton,
  FormHelperText,
} from "@mui/material";
import "./style.css";
import { useAxios } from "@/contexts/AxiosProvider";
import { useFormik } from "formik";
import { RoleSchema } from "@/validations/RoleSchema";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const NewRole = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const { Axios } = useAxios();
  const [permissions, setPermissions] = useState({});

  // Function to fetch permissions from the server
  const getPermissions = useCallback(async () => {
    try {
      // Make the API request to fetch permissions
      const res = await Axios.get("/permission/list");

      let selectedRole = {};
      let selectedPermissions = [];

      if (roleId) {
        // Make the API request to fetch permission
        const permissionRes = await Axios.get(`/role/show/${roleId}`);
        // Process the response data by role_id
        selectedRole = permissionRes.data?.data || {};

        setFieldValue("name", selectedRole.name);
        setFieldValue("description", selectedRole.description);
        selectedPermissions = selectedRole.permissions || [];
      }

      // Process the response data and group permissions by menu_id
      const permissionsData = (res.data?.data || []).map((permission) => ({
        ...permission,
        menu_id: permission.menu.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-"),
        checked: selectedPermissions
          .map(({ id }) => id)
          .includes(permission.id),
      }));

      // Make group permissions by menu_id
      const groupedPermissions = Object.groupBy(
        permissionsData,
        ({ menu_id }) => menu_id
      );

      // Update state with the fetched permissions, or set to an empty array if undefined
      setPermissions(groupedPermissions);
    } catch (error) {
      // Log an error message if there's an issue fetching permissions
      console.error("Error fetching permissions", error);
    }
  }, []);

  // Use useEffect to fetch leave types when the component mounts
  useEffect(() => {
    getPermissions();
  }, []); // Dependency array ensures that the effect runs only on mount

  const handleCheckboxChange = useCallback(
    (checked, key) => {
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        // Update the checked state based on the checkbox's checked state
        [key]: prevPermissions[key].map((permission) => ({
          ...permission,
          checked,
        })),
      }));
    },
    [setPermissions]
  );

  const handlePermissionsCheckboxChange = useCallback(
    (checked, key, index) => {
      // Update the state with the modified permissions array
      setPermissions((prevPermissions) => {
        const updatedPermissions = [...prevPermissions[key]];
        // Update the checked state of the permission at the specified index
        updatedPermissions[index] = { ...updatedPermissions[index], checked };
        return { ...prevPermissions, [key]: updatedPermissions };
      });
    },
    [setPermissions]
  );

  const areAllPermissionsChecked = useCallback(
    (key) => {
      return permissions[key].every(({ checked }) => checked);
    },
    [permissions]
  );

  // Function to find Permissions with checked set to true in a flat array
  const findCheckedPermissions = useCallback((data) => {
    // Initialize an array to store checked permission IDs
    return Object.values(data).reduce((checkedPermissions, menuItems) => {
      // Iterate over each item in the menu
      menuItems.forEach((item) => {
        // If the item's checked property is true, add its ID to the checkedPermissions array
        if (item.checked) {
          checkedPermissions.push(item.id);
        }
      });
      // Return the accumulated checked permissions IDs
      return checkedPermissions;
    }, []); // Start with an empty array
  }, []); // No dependencies since the function only depends on the data parameter

  useEffect(() => {
    const checkedPermissions = findCheckedPermissions(permissions);
    setFieldValue("permissions", checkedPermissions);
  }, [permissions]);

  const uncheckAllPermissions = useCallback(() => {
    setPermissions((prevPermissions) => {
      // Create a copy of the permissions object
      const updatedPermissions = { ...prevPermissions };
      // Iterate over each menu item
      Object.values(updatedPermissions).forEach((menuItems) => {
        menuItems.forEach((item) => {
          // Only update if the item is currently checked
          if (item.checked) {
            item.checked = false; // Set checked to false for each item
          }
        });
      });

      return updatedPermissions; // Return the updated permissions object
    });
  }, [setPermissions]);

  const handleResetForm = () => {
    uncheckAllPermissions();
    resetForm();
  };

  const onSubmitRole = async (values) => {
    try {
      if (!values.permissions.length) {
        toast.error("Permissions must be selected.");
        return;
      }

      if (values.permissions.length > 500) {
        toast.error("Role can have a maximum of 500 permissions.");
        return;
      }

      const endpoint = roleId ? `role/update/${roleId}` : `role/create`;

      const res = await Axios.post(endpoint, {
        ...values,
        ...(roleId && { _method: "put" }),
      });

      if (res.status === 201) {
        toast.success(
          roleId ? `Role Updated Successfully.` : `Role Created Successfully.`
        );
        handleResetForm();
        navigate("/roles");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.errors?.name[0] ||
          "Unable to connect to the server."
      );
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      description: "",
      permissions: [],
    },
    validationSchema: RoleSchema,
    onSubmit: onSubmitRole,
  });

  return (
    <React.Fragment>
      <Box sx={{ p: 4 }} component="form" onSubmit={handleSubmit}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            {" "}
            <span>New Role</span>{" "}
          </Stack>
          <CardContent>
            <Grid container spacing={2} p={0}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <FormGroup>
                  <InputLabel className="fixlabel">Role Name</InputLabel>
                  <TextField
                    id="role_name"
                    placeholder="Role Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    size="small"
                    value={values.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <FormHelperText className="error-msg">
                      {errors.name}
                    </FormHelperText>
                  )}
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={8}>
                <InputLabel className="fixlabel">Role Description</InputLabel>
                <TextField
                  id="role_description"
                  placeholder="Enter Role Description"
                  name="description"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <FormHelperText className="error-msg">
                    {errors.description}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </CardContent>
          {errors.permissions && (
            <FormHelperText className="error-msg">
              {errors.permissions}
            </FormHelperText>
          )}
          {Object.keys(permissions || "").length > 0
            ? Object.keys(permissions || "").map(function (key) {
                return (
                  <Box key={key + "-box"}>
                    <FormGroup
                      className="role-managment-header"
                      sx={{ px: 2, py: 1 }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={areAllPermissionsChecked(key)}
                            onChange={(event) => {
                              handleCheckboxChange(event.target.checked, key);
                            }}
                          />
                        }
                        label={key
                          .replace("-", " ")
                          .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                            letter.toUpperCase()
                          )}
                      />
                    </FormGroup>

                    <FormGroup
                      row
                      className="role-managment-body"
                      sx={{ px: 2, py: 1 }}
                    >
                      {permissions[key].map((permission, index) => {
                        return (
                          <FormControlLabel
                            key={`${permission.id}-${permission.name}`}
                            control={
                              <Checkbox
                                name={`permissions[]`}
                                value={permission.id}
                                checked={permission.checked}
                                onChange={(event) => {
                                  handlePermissionsCheckboxChange(
                                    event.target.checked,
                                    key,
                                    index
                                  );
                                }}
                              />
                            }
                            label={permission.name
                              .replace(/[^a-zA-Z0-9]+/g, " ")
                              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                                letter.toUpperCase()
                              )}
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                );
              })
            : Array.from({ length: 15 }).map((_, index) => (
                <Box key={index}>
                  <FormGroup
                    className="role-managment-header"
                    sx={{ px: 2, py: 1 }}
                  >
                    <FormControlLabel
                      control={<Checkbox />}
                      label={<Skeleton height={25} width={150} />}
                    />
                  </FormGroup>

                  <FormGroup
                    row
                    className="role-managment-body"
                    sx={{ px: 2, py: 1 }}
                  >
                    {Array.from({ length: 4 }).map((_, i) => (
                      <FormControlLabel
                        key={`${i}-${index}-role`}
                        control={<Checkbox />}
                        label={<Skeleton height={25} width={150} />}
                      />
                    ))}
                  </FormGroup>
                </Box>
              ))}

          <Stack direction="row" spacing={2} sx={{ px: 2, py: 3 }}>
            <Button
              color="primary"
              variant="contained"
              className="primary-btn text-capitalize"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
            <Button
              color="primary"
              variant="outlined"
              className=" text-capitalize"
              type="reset"
              onClick={handleResetForm}
            >
              Cancel
            </Button>
          </Stack>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default NewRole;
