import { Fragment, useCallback, useEffect, useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DocumentsForm from "./DocumentsFormSales";
import { useAxios } from "@/contexts/AxiosProvider";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleten from "../../../common/Skelton";
import ResourceFormSales from "./ResourceFormSales";
const AddProjectSales = () => {
  const { Axios } = useAxios();
  const { project_id } = useParams();
  const [projectData, setProjectData] = useState("");
  // State to store activities
  const [activities, setActivities] = useState([]);
  // State to store designations
  const [designations, setDesignations] = useState([]);

  const [loading, setLoading] = useState(false);

  // Get Departments List
  const getDesignations = useCallback(async () => {
    try {
      const res = await Axios.get("department/get-department-id?name=sales");

      const department = res?.data?.data;

      const response = await Axios.get(`department/show/${department?.id}`);
      if (response.status && response.status === 200) {
        const newDesignations = response?.data?.data?.designations?.map(
          (el) => ({
            value: el.id,
            label: el?.name,
          })
        );
        setDesignations(newDesignations);

        setActivities(response?.data?.data?.activities || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);

  //fetching project detail

  const getProjectDetails = async (project_id) => {
    try {
      setLoading(true);
      const res = await Axios.get(`project/show/${project_id}`);
      if (res.status && res.status >= 200 && res.status < 300) {
        setProjectData(res.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project_id) {
      getProjectDetails(project_id);
    }
    getDesignations();
  }, []);
  return (
    <Fragment>
      <Box sx={{ p: 4 }}>
        <Card variant="outlined" className="cardBox">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-header"
          >
            <span>Add Information (Sales)</span>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Tabs className="line-tab">
              <TabList className="tab-list-wrap">
                <Tab>Assigned Resource</Tab>
                <Tab
                  disabled={
                    Object.keys(projectData || "").length > 0 || project_id
                      ? false
                      : true
                  }
                >
                  Documents
                </Tab>
              </TabList>
              {loading ? (
                <Skeleten row={4} column={4} />
              ) : (
                <>
                  <TabPanel>
                    <ResourceFormSales
                      designations={designations}
                      projectData={projectData}
                      activities={activities}
                      getProjectDetails={getProjectDetails}
                    />
                  </TabPanel>
                  <TabPanel>
                    <DocumentsForm
                      projectData={projectData}
                      getProjectDetail={getProjectDetails}
                      loading={loading}
                    />
                  </TabPanel>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </Box>
    </Fragment>
  );
};

export default AddProjectSales;
