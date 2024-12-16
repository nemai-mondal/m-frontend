import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TableContainer,
  Table,
  Stack,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Pagination,
  InputAdornment,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "react-international-phone/style.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { useDispatch, useSelector } from "react-redux";
import AddHoliday from "./AddHoliday";
import EditHoliday from "./EditHoliday";
import DeleteHoliday from "./DeleteHoliday";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { FaFileDownload } from "react-icons/fa";
import { useAxios } from "@/contexts/AxiosProvider";
import Select from "react-select";
import {
  refresh,
  setPage,
  setPerPage,
  setSearchData,
  setListType,
} from "@/redux/HolidaySlice";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";
import { toast } from "react-toastify";
const HolidayManagement = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  const addHolidaySampleFile = "http://localhost:5173/addHolidaySampleFile.csv";
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.holiday
  );
  const { Axios } = useAxios();

  // Holiday Filter Options

  const holidayFilterOptions = [
    { label: "All", value: "all" },
    { label: "All (This year)", value: "all_this_year" },
    { label: "Upcoming (This year)", value: "upcoming_this_year" },
  ];

  //state to toogle for disable import button
  const [disableImportBtn, setDisableImportBtn] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState("");
  const [isAddOpen, setIsAddOpen] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [editHolidayData, setEditHolidayData] = useState("");
  const [deleteHolidayData, setDeleteHolidayData] = useState("");
  //to open add modal
  const openAddHoliday = () => {
    setIsAddOpen(true);
  };
  //to close add modal
  const closeAddHoliday = () => {
    setIsAddOpen(false);
  };
  //to open edit modal and store edit data
  const openEditHoliday = (data) => {
    setIsEditOpen(true);
    setEditHolidayData(data);
  };
  //to close edit modal
  const closeEditHoliday = () => {
    setIsEditOpen(false);
  };
  //to open delete modal and store delete data
  const openDeleteHoliday = (data) => {
    setIsDeleteOpen(true);
    setDeleteHolidayData(data);
  };
  //to close delete modal
  const closeDeleteHoliday = () => {
    setIsDeleteOpen(false);
  };
  //function to send page no to the redux store
  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };
  //function to send per page no to the redux store
  const handlePerPageChange = (newPerPage) => {
    dispatch(setPage(1));
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };
  //how many data should show in ui
  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];
  //function when user will search any data using search field 1
  const userSearchData = (data) => {
    dispatch(setSearchData(data));
  };

  const handleListType = (e) => {
    dispatch(setListType(e.value));
    dispatch(refresh());
  };
  //sending value to created hook to delay
  const deferredQuery = useDebounce(params.search_key);
  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch, deferredQuery]);
  //sending csv file value to api
  const handleFileChange = async (e) => {
    const type = e.target.files[0].type.split("/").pop();
    const formData = new FormData();
    formData.append("csv_file", e.target.files[0]);

    if (type === "csv") {
      setDisableImportBtn(true);
      try {
        const res = await Axios.post("holiday/upload-csv", formData);
        if (res.status && res.status >= 200 && res.status < 300) {
          e.target.value = null;
          setDisableImportBtn(false);
          toast.success(res.data.message);
          dispatch(refresh());
        }
      } catch (error) {
        e.target.value = null;
        setDisableImportBtn(false);
        toast.error(error.response.data.message);
      }
    } else {
      e.target.value = null;
      toast.error("only .csv file allowed");
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
            <span> Holidays</span>
            <Stack component="div" direction="row">
              <TextField
                variant="outlined"
                placeholder="Search..."
                size="small"
                sx={{ mr: 2 }}
                onChange={(e) => {
                  userSearchData(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: 200,
                  }),
                }}
                placeholder="Holidays"
                options={holidayFilterOptions}
                className="selectTag"
                classNamePrefix="select"
                onChange={handleListType}
              />

              {hasPermission("holiday_create") && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    className="cardHeaderBtn"
                    onClick={openAddHoliday}
                    style={{
                      marginRight: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    Add Holiday
                  </Button>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    <Box className="uploadFile-btn" sx={{ mr: 2 }}>
                      <input
                        type="file"
                        id="csv_btn"
                        accept=".csv"
                        onChange={handleFileChange}
                        disabled={disableImportBtn}
                      />
                      <label htmlFor="csv_btn">
                        <UploadFileRoundedIcon
                          color="success"
                          size={20}
                          title="import file to add holiday"
                        />
                      </label>
                      {disableImportBtn && (
                        <LinearProgress
                          sx={{ width: "100%", marginTop: "5px" }}
                        />
                      )}
                    </Box>
                  </div>
                  <a
                    href={addHolidaySampleFile}
                    download={addHolidaySampleFile.split("/").pop()}
                  >
                    <Button
                      title="download sample file"
                      variant="outlined"
                      size="small"
                      className="cardHeaderBtn h-35"
                      style={{ minWidth: "42px" }}
                    >
                      <FaFileDownload size={18} />
                    </Button>
                  </a>
                </>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList table-striped">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 100 }}>
                      Sl.No
                    </TableCell>
                    <TableCell align="left" sx={{ width: "auto" }}>
                      Holiday Name
                    </TableCell>
                    <TableCell align="center" sx={{ width: 140 }}>
                      From
                    </TableCell>
                    <TableCell align="center" sx={{ width: 140 }}>
                      To
                    </TableCell>
                    <TableCell align="center" sx={{ width: 140 }}>
                      Days
                    </TableCell>
                    <TableCell align="center" sx={{ width: 140 }}>
                      Created At
                    </TableCell>
                    <TableCell align="center" sx={{ width: 140 }}>
                      Last Updated At
                    </TableCell>
                    {hasAnyPermission(["holiday_update", "holiday_delete"]) && (
                      <TableCell align="center" sx={{ width: 140 }}>
                        Actions
                      </TableCell>
                    )}{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={10}
                      columns={
                        hasAnyPermission(["holiday_update", "holiday_delete"])
                          ? 8
                          : 7
                      }
                    />
                  ) : (data || []).length > 0 ? (
                    data.map((data, index) => {
                      const slNo = (params.current_page - 1) * 10;
                      return (
                        <React.Fragment key={data.id}>
                          <TableRow>
                            <TableCell align="center">
                              {" "}
                              {index + slNo + 1}
                            </TableCell>
                            <TableCell align="left">
                              {data.holiday_name || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {data.date_from
                                ? moment(data.date_from).format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {data.date_to
                                ? moment(data.date_to).format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {data.days || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {
                                // data.created_at
                                // ?
                                moment(data.created_at).format("DD-MM-YYYY")
                                // : "N/A"
                              }
                            </TableCell>
                            <TableCell align="center">
                              {
                                // data.updated_at
                                // ?
                                moment(data.updated_at).format("DD-MM-YYYY")
                                // : "N/A"
                              }
                            </TableCell>

                            {hasAnyPermission([
                              "holiday_update",
                              "holiday_delete",
                            ]) && (
                              <TableCell align="center">
                                {hasPermission("holiday_update") && (
                                  <>
                                    <Tooltip title="Update Holiday">
                                      <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() => {
                                          openEditHoliday(data);
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                {hasPermission("holiday_delete") && (
                                  <>
                                    <Tooltip title="Delete Holiday">
                                      <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => {
                                          openDeleteHoliday({
                                            id: data.id || "",
                                            holiday_name:
                                              data.holiday_name || "",
                                            date_from: data.date_from || "",
                                            date_to: data.date_to || "",
                                          });
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No Holiday Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            alignItems={"center"}
            sx={{ pb: 2 }}
          >
            <Typography>Rows per page</Typography>
            <select
              className="small-select"
              onChange={(event) => {
                handlePerPageChange(parseInt(event.target.value, 10));
              }}
            >
              {paginationPerPage.map((item) => {
                return (
                  <option key={item.id} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
            <Pagination
              count={meta?.last_page}
              page={params?.page}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
            />
          </Stack>
        </Card>
      </Box>
      {isAddOpen && (
        <AddHoliday isAddOpen={isAddOpen} closeAddHoliday={closeAddHoliday} />
      )}
      {isEditOpen && (
        <EditHoliday
          isEditOpen={isEditOpen}
          closeEditHoliday={closeEditHoliday}
          editHolidayData={editHolidayData}
        />
      )}
      {isDeleteOpen && (
        <DeleteHoliday
          isDeleteOpen={isDeleteOpen}
          closeDeleteHoliday={closeDeleteHoliday}
          deleteHolidayData={deleteHolidayData}
        />
      )}
    </React.Fragment>
  );
};

export default HolidayManagement;
