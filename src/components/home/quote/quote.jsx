import React, { useCallback, useContext, useEffect, useState } from "react";
import AddQuote from "./AddQuote";
import EditQuote from "./EditQuote";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import "./quote.css";
import { AuthContext } from "@/contexts/AuthProvider";
import EditIcon from "@mui/icons-material/Edit";
const Quote = () => {
  const { hasPermission, hasAnyPermission } = useContext(AuthContext);
  const { Axios } = useAxios();
  const [getFirstQuote, setFirstQuote] = useState("");
  //state to open edit quote modal
  const [isEditOpen, setIsEditOpen] = useState("");
  //state to open add quote modal
  const [isAddOpen, setIsAddOpen] = useState("");
  //state to store edit quote data
  const [editQuoteData, setEditQuoteData] = useState("");
  // function to open add quote modal
  const openAddQuote = () => {
    setFirstQuote(true);
    setIsAddOpen(true);
  };
  //function to close add quote modal
  const closeAddQuote = () => {
    setFirstQuote(false);
    setIsAddOpen(false);
  };
  //function to open edit quote modal and store edit quote data
  const openEditQuote = (data) => {
    setFirstQuote(true);
    setIsEditOpen(true);
    setEditQuoteData(data);
  };
  // function to close edit quote modal
  const closeEditQuote = () => {
    setFirstQuote(false);
    setIsEditOpen(false);
  };
  // state to store motivational list
  const [motivationalList, setMotivationalList] = useState("");
  //function to get motivational details from api
  const getmotivationalQuote = useCallback(async () => {
    try {
      const res = await Axios.get("motivational-quote/search?per_page=1");

      if (res.status && res.status === 200) {
        setMotivationalList(res.data?.data?.at(0) || {});
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  //useeffect to get motivational list when component mount
  useEffect(() => {
    getmotivationalQuote();
  }, []);

  return (
    <React.Fragment>
      <Card variant="outlined" className="cardBox quote h_100" sx={{ p: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="card-header"
        >
          <span>Today’s Quote</span>
          {hasPermission("motivational_quote_create") && (
            <>
              {Object.keys(motivationalList || {}).length > 0 ? (
                motivationalList.created_at ? (
                  moment(motivationalList.created_at).isSame(
                    moment(),
                    "day"
                  ) ? (
                    <Button
                      variant="outlined"
                      size="small"
                      className="cardHeaderBtn"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        openEditQuote(motivationalList);
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      className="cardHeaderBtn"
                      onClick={openAddQuote}
                      startIcon={<AddIcon />}
                    >
                      {" "}
                      ADD
                    </Button>
                  )
                ) : (
                  ""
                )
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  className="cardHeaderBtn"
                  onClick={openAddQuote}
                  startIcon={<AddIcon />}
                >
                  {" "}
                  ADD
                </Button>
              )}
            </>
          )}
        </Stack>

        {Object.keys(motivationalList||{}).length === 0 ? (
          <>
            <br />
            <p style={{ textAlign: "center" }}> No Motivational Quote...</p>
          </>
        ) : (
          <CardContent sx={{ p: 2, height: "calc(100% - 49px)" }}>
            <Stack
              alignItems="center"
              justifyContent="center"
              className="h_100"
            >
              <Typography
                component="p"
                className="quote-text"
                textAlign="center"
              >
                {motivationalList?.quote
                  ? `""${motivationalList.quote}""`
                  : "N/A"}
              </Typography>

              {motivationalList?.image ? (
                <Avatar
                  alt="Abraham Lincoln"
                  src={motivationalList.image}
                  className="quote-pic"
                  sx={{ width: 50, height: 50 }}
                />
              ) : (
                <Avatar>
                  {" "}
                  <PersonIcon />{" "}
                </Avatar>
              )}
              <Typography
                component="p"
                className="quote-author-name"
                textAlign="center"
              >
                {motivationalList?.said_by || "N/A"}
              </Typography>
            </Stack>
          </CardContent>
        )}
      </Card>

      {/* Add and edit  */}

      {isAddOpen && (
        <AddQuote
          isAddOpen={isAddOpen}
          closeAddQuote={closeAddQuote}
          getmotivationalQuote={getmotivationalQuote}
          getFirstQuote={getFirstQuote}
        />
      )}
      {isEditOpen && (
        <EditQuote
          isEditOpen={isEditOpen}
          closeEditQuote={closeEditQuote}
          editQuoteData={editQuoteData}
          getmotivationalQuote={getmotivationalQuote}
          getFirstQuote={getFirstQuote}
        />
      )}
    </React.Fragment>
  );
};

export default Quote;
