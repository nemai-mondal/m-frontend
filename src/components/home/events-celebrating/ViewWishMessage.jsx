import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Box,
  IconButton,
  MenuItem,
  Tooltip,
  Menu,
  ListItemIcon,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAxios } from "@/contexts/AxiosProvider";
import moment from "moment";
import { AuthContext } from "@/contexts/AuthProvider";
import ViewWishModal from "./ViewWishModal";
const ViewWishMessage = () => {
  const { user } = useContext(AuthContext);
  // const [loading, setLoading] = useState(true);
  const { Axios } = useAxios();

  // state to open view modal
  const [isViewOpen, setIsViewOpen] = useState("");
  //state to store view wish data
  const [viewWishData, setViewWishData] = useState("");

  //function to open view wish modal and store view wish data
  const openViewWish = (data) => {
    setIsViewOpen(true);
    setViewWishData(data);
  };
  //function to close view wish modal
  const closeViewWish = () => {
    setIsViewOpen(false);
  };
  //state to store wish details
  const [wishes, setWishes] = useState([]);
  const [randomColor, setRandomColor] = useState([]);
  //fetching wish data
  const fetchWish = async (id) => {
    try {
      const res = await Axios.get(`event-wish/my-wishesh?user_id=${id}`);

      if (res.status && res.status >= 200 && res.status < 300) {
        setWishes(res.data?.data || []);
        if ((res?.data?.data || []).length > 0) {
          const newColors = (res?.data?.data || []).map(() => {
            return (
              "#" +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
                .toUpperCase()
            );
          });
          setRandomColor(newColors);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  useEffect(() => {
    if (user.id) {
      fetchWish(user.id);
    }
  }, [user]);
  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox h_100">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>Wishes</span>
        </Stack>
        <CardContent sx={{ p: 2 }} className="cardheight scroll-y">
          <TableContainer className="userList">
            <Table aria-label="simple table">
              <TableBody>
                {(wishes || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No Wishes...
                    </TableCell>
                  </TableRow>
                ) : (
                  (wishes || []).map((data, index) => {
                    return (
                      <React.Fragment key={data.id}>
                        <TableRow>
                          <TableCell align="left">
                            <Stack direction="row">
                              {data?.user?.profile_image ? (
                                <Avatar
                                  alt="Remy Sharp"
                                  src={data.user.profile_image}
                                  className="avtar"
                                />
                              ) : data?.user?.first_name ? (
                                <Avatar
                                  sx={{ bgcolor: randomColor[index] }}
                                  className="avtar"
                                >
                                  {data?.user?.first_name[0] || ""}
                                </Avatar>
                              ) : (
                                <Avatar alt="Remy Sharp" className="avtar" />
                              )}

                              <Box>
                                <Typography
                                  component="h6"
                                  className="avtarName"
                                >
                                  Wish from{" "}
                                  {`${
                                    data.user?.honorific
                                      ? `${data.user?.honorific} `
                                      : ""
                                  }${data.user?.first_name || ""} ${
                                    data.user?.middle_name
                                      ? `${data.user.middle_name} `
                                      : ""
                                  }${data.user?.last_name || ""}`}
                                </Typography>
                                <Typography component="p" className="avtarDeg">
                                  {`${
                                    data?.created_at
                                      ? moment(data.created_at).format(
                                          "DD MMM YYYY"
                                        )
                                      : "N/A"
                                  }`}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              className="cardHeaderBtn"
                              onClick={() => {
                                openViewWish(data);
                              }}
                            >
                              view wish
                            </Button>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {isViewOpen && (
        <ViewWishModal
          isViewOpen={isViewOpen}
          closeViewWish={closeViewWish}
          viewWishData={viewWishData}
        />
      )}
    </React.Fragment>
  );
};

export default ViewWishMessage;
