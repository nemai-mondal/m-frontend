import { useEffect } from "react";
import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { refresh, setPage, setPerPage } from "@/redux/AppliedLeaveSlice";
import moment from "moment";
import TableRowSkeleton from "../common/TableRowSkeleton";

export default function AppliedLeave() {
  const dispatch = useDispatch();
  const { data, meta, params, isLoading } = useSelector(
    (state) => state.appliedLeave
  );

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(refresh());
  };

  const handlePerPageChange = (newPerPage) => {
    dispatch(setPage(1));
    dispatch(setPerPage(newPerPage));
    dispatch(refresh());
  };

  const leaveStatus = {
    approved: "success",
    pending: "warning",
    rejected: "error",
  };

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  const paginationPerPage = [
    { id: 1, label: "10", value: 10 },
    { id: 2, label: "20", value: 20 },
    { id: 3, label: "50", value: 50 },
    { id: 4, label: "100", value: 100 },
  ];

  return (
    <>
      <TableContainer className="table-striped">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Leave Type</TableCell>
              <TableCell align="left">From Date</TableCell>
              <TableCell align="left">Till Date</TableCell>
              <TableCell align="left">Days</TableCell>
              <TableCell align="left">Applied</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Last Action By</TableCell>
              <TableCell align="left">Last Action On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRowSkeleton rows={params.per_page} columns={8} />
            ) : data.length ? (
              data.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell align="left">
                      {item.leave_type?.name || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {moment(item.leave_from).format("ddd DD-MMM-YY")}
                    </TableCell>
                    <TableCell align="left">
                      {moment(item.leave_to).format("ddd DD-MMM-YY")}
                    </TableCell>
                    <TableCell align="left">{item.total_days}</TableCell>
                    <TableCell align="left">
                      {moment(item.created_at).format("ddd DD-MMM-YY")}
                    </TableCell>
                    <TableCell align="left">
                      <Chip
                        label={item.leave_status}
                        color={leaveStatus[item.leave_status]}
                        variant="contained"
                        size="small"
                        className={
                          "chip fs-12 " + leaveStatus[item.leave_status]
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      {item.action_taken_by || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {(item.action_taken_at &&
                        moment(item.action_taken_at).format(
                          "ddd DD-MMM-YY HH:mm"
                        )) ||
                        "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Leave Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        alignItems={"center"}
        mt={3}
      >
        <Stack direction="row" spacing={2}>
          <Typography component="div" className="tag success">
            Approved
          </Typography>
          <Typography component="div" className="tag warning">
            Pending
          </Typography>
          <Typography component="div" className="tag error">
            Rejected
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          spacing={2}
          alignItems={"center"}
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
      </Stack>
    </>
  );
}
