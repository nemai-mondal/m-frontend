import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Avatar,
  Skeleton,
} from "@mui/material";
import { ImagePath } from "@/ImagePath";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthProvider";
const Permissions = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  const { userId } = useParams();
  const { Axios } = useAxios();
  const navigate = useNavigate();

  const [chipData, setChipData] = useState([
    { key: 0, label: "Angular" },
    { key: 1, label: "jQuery" },
    { key: 2, label: "Polymer" },
    { key: 3, label: "React" },
    { key: 4, label: "Vue.js" },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chipData) =>
      chipData.filter((chipData) => chipData.key !== chipToDelete.key)
    );
  };

  // Function to group permissions by menu
  const groupPermissionsByMenu = (roles) => {
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: Object.entries(
        role.permissions.reduce((acc, permission) => {
          const { menu, id, name } = permission;
          const menuId = menu.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
          acc[menuId] = acc[menuId] || [];
          acc[menuId].push({ id, name });
          return acc;
        }, {})
      ).map(([menu, permissions]) => ({ menu, permissions })),
    }));
  };

  // Function to get flat permissions
  const getFlatPermissions = (roles) => {
    return roles.reduce((flatPermissions, role) => {
      role.permissions.forEach((permission) => {
        flatPermissions.push(permission.name);
      });
      return flatPermissions;
    }, []);
  };

  const [rolesAndPermissions, setRolesAndPermissions] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [userLoading, setUserLoading] = useState(true);
  const [permissions, setPermissions] = useState({});

  const getRolesAndPermissions = useCallback(async () => {
    try {
      // Fetch user data including roles
      const res = await Axios.get(`user/show/${userId}`);
      const data = res?.data?.data || [];
      // Fetch all available permissions
      const permissionRes = await Axios.get("/permission/list");
      // Extract flat permissions from user roles
      const userFlatPermissions = getFlatPermissions(data?.roles || []);
      // Extract permissions from user direct permissions
      const userDirectPermissions = (data?.permissions || []).map(
        ({ id }) => id
      );
      // Filter out permissions already assigned to the user
      const permissionsData = (permissionRes.data?.data || [])
        .filter((permission) => !userFlatPermissions.includes(permission.name))
        .map((permission) => ({
          ...permission,
          // Generate menu_id based on menu name, replacing spaces with hyphens
          menu_id: permission.menu.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-"),
          checked: userDirectPermissions.includes(permission.id), // Add 'checked' property for UI purposes
        }));
      // Group permissions by menu_id
      const groupedPermissions = Object.groupBy(
        permissionsData,
        ({ menu_id }) => menu_id
      );
      // Update state with the fetched permissions
      setPermissions(groupedPermissions);
      // Set user details including name, designation, and image
      setUserDetail({
        name: `${data.honorific} ${data.first_name}${
          data.middle_name ? " " + data.middle_name : ""
        }${data.last_name ? " " + data.last_name : ""}`,
        designation: data.designation?.name,
        image: data.image,
      });
      // Group roles with permissions by menu
      setRolesAndPermissions(groupPermissionsByMenu(data?.roles || []));
      // Set user loading state to false
      setUserLoading(false);
    } catch (error) {
      // If there's an error, set user loading state to false and log the error
      setUserLoading(false);
      console.error("Error fetching user details and permissions", error);
    }
  }, []); // No dependencies, runs only once

  useEffect(() => {
    getRolesAndPermissions();
  }, []);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const checkedPermissions = findCheckedPermissions(permissions);
      if (!checkedPermissions.length) {
        toast.error("Permissions must be selected.");
        setIsSubmitting(false);
        return;
      }

      const res = await Axios.post("user/assign-permission", {
        user_id: userId,
        permission_ids: checkedPermissions,
      });

      if (res.status === 200) {
        toast.success(`Permissions Sync Successfully.`);
        navigate("/users-list");
      } else {
        toast.error("Something went wrong.");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        error?.response?.data?.message || "Unable to connect to the server."
      );
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            {" "}
            <span>Permissions</span>{" "}
          </Stack>
          <CardContent>
            <Stack direction="row" className="userList">
              <Avatar
                alt="Remy Sharp"
                src={userDetail.image || ImagePath.Avatar}
                className="avtar"
              />
              <Box>
                <Typography component="h6" className="avtarName">
                  {userLoading ? <Skeleton width={150} /> : userDetail.name}
                </Typography>
                <Typography component="p" className="smallText">
                  {userLoading ? (
                    <Skeleton width={150} />
                  ) : (
                    userDetail.designation || "Not Available"
                  )}
                </Typography>
              </Box>
            </Stack>
            {userLoading ? (
              Array.from({ length: 1 }).map((_, index) => (
                <React.Fragment key={`skel-${index}`}>
                  <Typography
                    className="heading-5"
                    component="h4"
                    sx={{ border: 0, mt: 3, pb: 1 }}
                  >
                    <Skeleton width={150} />
                  </Typography>
                  <Typography className="text" component="p">
                    <Skeleton width={"75%"} />
                  </Typography>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <React.Fragment key={`skel-${index}-${i}`}>
                      <Typography
                        className="heading-3"
                        component="h5"
                        sx={{ mt: 2 }}
                      >
                        <Skeleton width={150} />
                      </Typography>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        sx={{ mt: 1, mb: 3 }}
                        spacing={2}
                      >
                        {Array.from({ length: 4 }).map((_, ci) => (
                          <Chip
                            key={`skel-${index}-${i}-${ci}`}
                            label={<Skeleton width={150} />}
                            className="closeable-chip"
                          />
                        ))}
                      </Stack>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            ) : (rolesAndPermissions||[]).length > 0 ? (
              rolesAndPermissions.map((role) => {
                return (
                  <React.Fragment key={role.id}>
                    <Typography
                      className="heading-5"
                      component="h4"
                      sx={{ border: 0, mt: 3, pb: 1 }}
                    >
                      {role.name.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                        letter.toUpperCase()
                      )}{" "}
                      Permissions
                    </Typography>

                    <Typography className="text" component="p">
                      {role.description || "N/A"}
                    </Typography>

                    {role?.permissions?.length > 0 &&
                      role.permissions.map((permission) => {
                        return (
                          <React.Fragment key={`${role.id}-${permission.menu}`}>
                            <Typography
                              className="heading-3"
                              component="h5"
                              sx={{ mt: 2 }}
                            >
                              {permission.menu
                                .replace("-", " ")
                                .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                                  letter.toUpperCase()
                                )}
                            </Typography>

                            {/* <Stack
                              direction="row"
                              flexWrap="wrap"
                              sx={{ mt: 1, mb: 3 }}
                              spacing={2}
                            >
                              {permission?.permissions?.map((data, index) => (
                                <Chip
                                  label={data.name
                                    .replace(/[^a-zA-Z0-9]+/g, " ")
                                    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                                      letter.toUpperCase()
                                    )}
                                  key={`${role.id}-${permission.menu}-${data.id}`}
                                  className="closeable-chip"
                                />
                              ))}
                            </Stack> */}

                            <Stack
                              direction="row"
                              flexWrap="wrap"
                              sx={{ mt: 1, mb: 3 }}
                              spacing={2}
                            >
                              {permission?.permissions?.map((data, index) => (
                                <div
                                  key={`${role.id}-${permission.menu}-${data.id}`}
                                  style={{ margin: "10px" }}
                                >
                                  <Chip
                                    label={data.name
                                      .replace(/[^a-zA-Z0-9]+/g, " ")
                                      .replace(
                                        /(^\w{1})|(\s+\w{1})/g,
                                        (letter) => letter.toUpperCase()
                                      )}
                                    className="closeable-chip"
                                  />
                                </div>
                              ))}
                            </Stack>
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                );
              })
            ) : (
              <Typography
                className="text"
                component="p"
                sx={{ border: 0, mt: 3, pb: 1 }}
              >
                No permissions are allowed for this user yet!
              </Typography>
            )}
          </CardContent>

          {hasPermission("user_permission_assign") && (
            <>
              <CardContent>
                <Typography
                  className="heading-5"
                  component="h4"
                  sx={{ border: 0, pb: 1 }}
                >
                  Direct Permissions
                </Typography>
                {/* <Typography className="text" component="p" sx={{ mb: 1 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.Lorem ipsum dolor sit consectetur
                  adipiscing.
                </Typography> */}
              </CardContent>
              {userLoading ? (
                Array.from({ length: 15 }).map((_, index) => (
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
                ))
              ) : Object.keys(permissions||"").length > 0 ? (
                Object.keys(permissions||"").map(function (key) {
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
              ) : (
                <CardContent>
                  <Typography className="text" component="p" sx={{ border: 0 }}>
                    Direct permissions not available for this user.
                  </Typography>
                </CardContent>
              )}

              <Stack direction="row" spacing={2} sx={{ px: 2, py: 3 }}>
                <Button
                  color="primary"
                  variant="contained"
                  className="primary-btn text-capitalize"
                  disabled={isSubmitting || Object.keys(permissions||"").length < 1}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  className=" text-capitalize"
                  disabled={Object.keys(permissions||"").length < 1}
                  onClick={uncheckAllPermissions}
                >
                  Cancel
                </Button>
              </Stack>
            </>
          )}
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default Permissions;
