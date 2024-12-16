import React, { useCallback, useEffect, useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import ProjectInformationForm from "./ProjectInformationFormHR";
import DocumentsForm from "./DocumentsFormHR";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import Skeleten from "../../../common/Skelton";
import AssignedResourceFormHR from "./ResourceFormHR";
const AddProjectHR = () => {
  const { Axios } = useAxios();
  const { project_id } = useParams();
  // State to store employees
  const [employees, setEmployees] = useState([]);
  // State to store clients
  const [clients, setClients] = useState([]);
  // State to store activities
  const [activities, setActivities] = useState([]);
  // State to store designations
  const [designations, setDesignations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState("");

  // Get Designations List
  const getDesignations = async () => {
    try {
      const res = await Axios.get("department/get-department-id?name=hr");

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
  };
  // Function to fetch employees from the server
  const getEmployees = useCallback(async () => {
    try {
      // Make the API request to fetch employees
      const res = await Axios.get("/user/list");

      // Update date with the fetched employees, or set to an empty array if undefined
      if (res.status && res.status >= 200 && res.status < 300) {
        setEmployees(
          (res.data?.data || []).map((m) => {
            return {
              value: m.id,
              label: `${m.honorific} ${m.first_name}${
                m.middle_name ? " " + m.middle_name : ""
              }${m.last_name ? " " + m.last_name : ""} - ${m.employee_id}`,
            };
          })
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  }, []);
  //fetching clients
  const getCLientDetails = async () => {
    try {
      const res = await Axios.get("client/list");
      if (res.status && res.status >= 200 && res.status < 300) {
        const clientallData = (res.data?.data || []).map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setClients(clientallData);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };

  //fetching project details
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
    getCLientDetails();
    getEmployees();
    getDesignations();
    if (project_id) {
      getProjectDetails(project_id);
    }
  }, [project_id]);

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
            <span>Add Information (Human Resource)</span>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Tabs className="line-tab">
              <TabList className="tab-list-wrap">
                <Tab>Information</Tab>
                <Tab
                  disabled={
                    Object.keys(projectData || "").length > 0 || project_id
                      ? false
                      : true
                  }
                >
                  Assigned Resource
                </Tab>
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
                    <ProjectInformationForm
                      clients={clients}
                      employees={employees}
                      projectData={projectData}
                      getProjectDetails={getProjectDetails}
                    />
                  </TabPanel>
                  <TabPanel>
                    <AssignedResourceFormHR
                      designations={designations}
                      projectData={projectData}
                      activities={activities}
                      getProjectDetails={getProjectDetails}
                      loading={loading}
                    />
                  </TabPanel>
                  <TabPanel>
                    <DocumentsForm
                      projectData={projectData}
                      getProjectDetails={getProjectDetails}
                      loading={loading}
                    />
                  </TabPanel>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default AddProjectHR;
