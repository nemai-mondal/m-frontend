import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TableContainer,
  Table,
  Stack,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Pagination,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-international-phone/style.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import AddAmendment from "./AddAmendment";
import TableRowSkeleton from "@/components/common/TableRowSkeleton";
import { FaEye } from "react-icons/fa";
import EditAmendment from "./EditAmendment";
import DeletAmendment from "./DeleteAmendment";
import { AuthContext } from "@/contexts/AuthProvider";
import { useDebounce } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import SendIcon from "@mui/icons-material/Send";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import {
  refresh,
  setPage,
  setPerPage,
  setSearchData,
} from "@/redux/AmendmentSlice";
import DeleteMultiAmendment from "./DeleteMultiAmendment";
import PublishAmendmentModal from "./PublishAmendmentModal";
const Amendment = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  //dispatch to send request to redux store
  const dispatch = useDispatch();
  //getting data from redux store
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.amendment
  );
  //state to store multiple document id
  const [documentId, setDocumentId] = useState([]);

  //state to store checked value on header section
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  //creating array, based on data length to control checked/unchecked for every field
  const [checkedItems, setCheckedItems] = useState([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editAmendmentData, setEditAmendmenttData] = useState("");
  const [deleteAmendmentData, setDeleteAmendmenttData] = useState("");
  const [isMultiDeleteOpen, setIsMultiDeleteOpen] = useState(false);
  const [deleteMultiDocumentData, setDeleteMultiDocumentData] = useState("");
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishData, setPublishData] = useState("");
  //to open publish modal
  const openPublishModal = (data) => {
    setIsPublishOpen(true);
    setPublishData(data);
  };
  //to close publish modal
  const closePublishModal = () => {
    setIsPublishOpen(false);
  };
  //to open add modal
  const openAddAmendment = () => {
    setIsAddOpen(true);
  };
  //to close add modal
  const closeAddAmendment = () => {
    setIsAddOpen(false);
  };
  //to open edit modal and store edit data
  const openEditAmendment = (data) => {
    setIsEditOpen(true);
    setEditAmendmenttData(data);
  };
  //to close edit modal
  const closeEditAmendment = () => {
    setIsEditOpen(false);
  };
  //to open delete modal and store delete data
  const openDeleteAmendment = (data) => {
    setIsDeleteOpen(true);
    setDeleteAmendmenttData(data);
  };
  //to close delete modal
  const closeDeleteAmendment = () => {
    setIsDeleteOpen(false);
  };
  //to open multi delete modal and store delete data
  const openDeleteMultiCandidate = () => {
    setIsMultiDeleteOpen(true);
    setDeleteMultiDocumentData(documentId);
  };
  //to close delete modal
  const closeDeleteMultiCandidate = () => {
    setIsMultiDeleteOpen(false);
  };
  //function to checked and unchecked all field
  const toggleSelectAll = () => {
    const newCheckedItems = [...checkedItems];
    const newSelectAllChecked = !selectAllChecked;
    data.forEach((data, index) => {
      if (newSelectAllChecked) {
        documentId[index] = data.id;
      } else {
        setDocumentId([]);
      }
      newCheckedItems[index] = newSelectAllChecked;
    });
    setCheckedItems(newCheckedItems);
    setSelectAllChecked(newSelectAllChecked);
  };
  //function to checked and unchecked particular field

  const handleCheckboxChange = (index, id) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    if (!newCheckedItems[index]) {
      setDocumentId(documentId.filter((item) => item != id));
    } else {
      setDocumentId([...documentId, id]);
    }
    setCheckedItems(newCheckedItems);
    const allChecked = newCheckedItems.every((item) => item);
    setSelectAllChecked(allChecked);
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
  //function when user will search any data using search field
  const userSearchData = (data) => {
    dispatch(setSearchData(data));
  };
  //sending value to created hook to delay
  const deferredQuery = useDebounce(params.search_key);
  //useeffect to send request to redux store when component mount
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(refresh());
  }, [dispatch, deferredQuery]);
  //useeffect to store length of the data for checkbox when component
  useEffect(() => {
    if (data) {
      setCheckedItems(new Array(data.length).fill(false));
      setSelectAllChecked(false);
    }
  }, [data]);

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
            <span>Documents</span>
            <Stack component="div" direction="row" spacing={2}>
              {checkedItems.some((el) => el === true) && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={openDeleteMultiCandidate}
                >
                  Delete
                </Button>
              )}
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
              {hasPermission("amendment_create") && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className="cardHeaderBtn"
                  onClick={openAddAmendment}
                >
                  Add Document
                </Button>
              )}
            </Stack>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <TableContainer className="userList table-striped">
              <Table sx={{ minWidth: 1150 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {hasPermission("amendment_delete") && data?.length > 0 && (
                      <TableCell align="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectAllChecked}
                              onChange={toggleSelectAll}
                            />
                          }
                        />
                      </TableCell>
                    )}
                    <TableCell align="center">Sl.No</TableCell>
                    <TableCell align="left">Document Name</TableCell>
                    <TableCell align="center">View</TableCell>
                    <TableCell align="center">Download</TableCell>
                    <TableCell align="center">Created At</TableCell>
                    <TableCell align="center">Last Updated At</TableCell>
                    {hasAnyPermission([
                      "amendment_update",
                      "amendment_delete",
                    ]) && <TableCell align="center">Actions</TableCell>}{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton
                      rows={10}
                      columns={
                        hasAnyPermission([
                          "amendment_update",
                          "amendment_delete",
                        ])
                          ? 8
                          : 6
                      }
                    />
                  ) : (data||[])?.length > 0 ? (
                    data.map((data, index) => {
                      const slNo = (params.current_page - 1) * 10;
                      return (
                        <React.Fragment key={data.id}>
                          <TableRow>
                            {hasPermission("amendment_delete") && (
                              <TableCell align="center">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={checkedItems[index] || false}
                                      onChange={() =>
                                        handleCheckboxChange(index, data.id)
                                      }
                                    />
                                  }
                                />
                              </TableCell>
                            )}
                            <TableCell align="center">
                              {index + slNo + 1}
                            </TableCell>
                            <TableCell align="left">
                              {data?.name || "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {data?.document ? (
                                <a
                                  href={`https://docs.google.com/gview?url=${data.document}&embedded=true`}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <FaEye
                                    style={{ fontSize: "22" }}
                                    color="gray"
                                  />
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {data?.document ? (
                                <a
                                  href={`https://docs.google.com/gview?url=${data.document}&embedded=true`}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <IconButton
                                    aria-label="download"
                                    size="small"
                                    title={data.document}
                                  >
                                    <GetAppIcon style={{ color: "gray" }} />
                                  </IconButton>
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            {/* <TableCell align="center">
                              {data?.document ? (
                                <IconButton aria-label="download" size="small">
                                  {FileSaver.saveAs(`${data.document}`, `${data.document.split("/").pop()}`)}
                                  <a
                                    href={data.document}
                                    download={data.document.split("/").pop()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {" "}
                                    <GetAppIcon style={{ color: "gray" }} />
                                  </a>
                                </IconButton>
                              ) : (
                                "N/A"
                              )}
                            </TableCell> */}
                            <TableCell align="center">
                              {data?.created_at
                                ? moment(data.created_at).format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {data?.updated_at
                                ? moment(data.updated_at).format("DD-MM-YYYY")
                                : "N/A"}
                            </TableCell>

                            {hasAnyPermission([
                              "amendment_update",
                              "amendment_delete",
                            ]) && (
                              <TableCell align="center">
                                {hasPermission("amendment_update") && (
                                  <>
                                    <Tooltip title="Update Document">
                                      <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() => {
                                          openEditAmendment(data);
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                {hasPermission("amendment_delete") && (
                                  <>
                                    <Tooltip title="Delete Document">
                                      <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => {
                                          openDeleteAmendment(data);
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                {data?.status === 1 ? (
                                  <Tooltip title="Un Publish Document">
                                    <IconButton
                                      aria-label="delete"
                                      color="primary"
                                      onClick={() => {
                                        openPublishModal(data);
                                      }}
                                    >
                                      <CancelScheduleSendIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Publish Document">
                                    <IconButton
                                      aria-label="delete"
                                      color="primary"
                                      onClick={() => {
                                        openPublishModal(data);
                                      }}
                                    >
                                      <SendIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No Document Found
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
        <AddAmendment
          isAddOpen={isAddOpen}
          closeAddAmendment={closeAddAmendment}
        />
      )}
      {isEditOpen && (
        <EditAmendment
          isEditOpen={isEditOpen}
          closeEditAmendment={closeEditAmendment}
          editAmendmentData={editAmendmentData}
        />
      )}
      {isDeleteOpen && (
        <DeletAmendment
          isDeleteOpen={isDeleteOpen}
          closeDeleteAmendment={closeDeleteAmendment}
          deleteAmendmentData={deleteAmendmentData}
        />
      )}

      {isMultiDeleteOpen && (
        <DeleteMultiAmendment
          isMultiDeleteOpen={isMultiDeleteOpen}
          closeDeleteMultiCandidate={closeDeleteMultiCandidate}
          deleteMultiDocumentData={deleteMultiDocumentData}
        />
      )}
      {isPublishOpen && (
        <PublishAmendmentModal
          isPublishOpen={isPublishOpen}
          publishData={publishData}
          closePublishModal={closePublishModal}
        />
      )}
    </React.Fragment>
  );
};

export default Amendment;
