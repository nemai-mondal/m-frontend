import React, { useCallback, useEffect, useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import ProjectInformationForm from "./ProjectInformationFormMarketing";
import DocumentsForm from "./DocumentsFormMarketing";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";
import ResourceFormMarketing from "./ResourceFormMarketing";
const AddProjectMarketing = () => {
  const { Axios } = useAxios();
  const { project_id } = useParams();
  const [projectData, setProjectData] = useState("");
  // State to store employees
  const [employees, setEmployees] = useState([]);
  // State to store clients
  const [clients, setClients] = useState([]);
  //state to store department designations
  const [designations, setDesignations] = useState([]);

  const [activities, setActivities] = useState([]);

  const [loading,setLoading] = useState(false);

  // Get Designations List
  const getDesignations = async () => {
    try {
      const res = await Axios.get(
        "department/get-department-id?name=marketing"
      );

      const department = res?.data?.data;
      const response = await Axios.get(`department/show/${department?.id}`);
      if (response.status && response.status === 200) {
        const newDesignations = response?.data?.data?.designations?.map(
          (el) => ({
            value: el.id,
            label: el?.name,
          })
        );
        setActivities(response?.data?.data?.activities || []);
        setDesignations(newDesignations);
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
              label: `${m?.honorific ? `${m?.honorific} ` : ""}${
                m?.first_name || ""
              } ${m?.middle_name ? `${m.middle_name} ` : ""}${
                m?.last_name || ""
              }-${m.employee_id || ""}`,
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

  //fetching project detail
  const getProjectDetail = async (project_id) => {
    try {
      setLoading(true)
      const res = await Axios.get(`project/show/${project_id}`);
      if (res.status && res.status >= 200 && res.status < 300) {
        setProjectData(res.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    getEmployees();
    getCLientDetails();
    getDesignations();
    if (project_id) {
      getProjectDetail(project_id);
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
            <span>Add Information (Marketing)</span>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Tabs className="line-tab">
              <TabList className="tab-list-wrap">
                <Tab>Information</Tab>
                <Tab
                  disabled={
                    Object.keys(projectData || "").length > 0 ? false : true
                  }
                >
                  Assigned Resource
                </Tab>
                <Tab
                  disabled={
                    Object.keys(projectData || "").length > 0 ? false : true
                  }
                >
                  Documents
                </Tab>
              </TabList>
              <TabPanel>
                <ProjectInformationForm
                  projectData={projectData}
                  getProjectDetail={getProjectDetail}
                  employees={employees}
                  clients={clients}
                />
              </TabPanel>
              <TabPanel>
                <ResourceFormMarketing
                  projectData={projectData}
                  getProjectDetail={getProjectDetail}
                  designations={designations}
                  activities={activities}
                />
              </TabPanel>
              <TabPanel>
                <DocumentsForm
                  projectData={projectData}
                  getProjectDetail={getProjectDetail}
                  loading={loading}
                />
              </TabPanel>
            </Tabs>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default AddProjectMarketing;
