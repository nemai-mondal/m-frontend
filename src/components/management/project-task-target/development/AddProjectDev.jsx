import React, { useCallback, useEffect, useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import ProjectInformationForm from "./ProjectInformationFormDev";
import DocumentsForm from "./DocumentsFormDev";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAxios } from "@/contexts/AxiosProvider";
import ResourceFormDev from "./ResourceFormDev";
const AddProjectDev = () => {
  const { Axios } = useAxios();
  const { project_id } = useParams();
  const [projectData, setProjectData] = useState("");
  // State to store employees
  const [employees, setEmployees] = useState([]);
  // State to store clients
  const [clients, setClients] = useState([]);
  // State to store technologies
  const [technologies, setTechnologies] = useState([]);
  //state to store department
  const [departments, setDepartments] = useState([]);
  // Get Departments List
  const getDepartments = async () => {
    try {
      const response = await Axios.get("department/list");

      if (response.status && response.status === 200) {
        const departments = (response.data?.data || []).map((department) => ({
          value: department.id,
          label: `${department.name}`,
        }));
        setDepartments(departments);
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
  //fetching technologies
  const getTechnologies = async () => {
    try {
      const res = await Axios.get("technology/list");
      if (res.status && res.status >= 200 && res.status < 300) {
        const technologyAllData = (res.data?.data || []).map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setTechnologies(technologyAllData);
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
      const res = await Axios.get(`project/show/${project_id}`);
      if (res.status && res.status >= 200 && res.status < 300) {
        setProjectData(res.data?.data || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Unable to connect to the server");
      }
    }
  };
  useEffect(() => {
    getCLientDetails();
    getEmployees();
    getTechnologies();
    getDepartments();
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
            <span>Add Project (Development)</span>
          </Stack>
          <CardContent sx={{ p: 0 }}>
            <Tabs className="line-tab">
              <TabList className="tab-list-wrap">
                <Tab>Information</Tab>
                <Tab
                  disabled={Object.keys(projectData||"").length > 0 ? false : true}
                >
                  Assigned Resource
                </Tab>
                <Tab
                  disabled={Object.keys(projectData||"").length > 0 ? false : true}
                >
                  Documents
                </Tab>
              </TabList>
              <TabPanel>
                <ProjectInformationForm
                  projectData={projectData}
                  getProjectDetail={getProjectDetail}
                  technologies={technologies}
                  employees={employees}
                  clients={clients}
                />
              </TabPanel>
              <TabPanel>
                <ResourceFormDev
                  projectData={projectData}
                  getProjectDetail={getProjectDetail}
                  employees={employees}
                  departments={departments}
                />
              </TabPanel>
              <TabPanel>
                <DocumentsForm
                  projectData={projectData}
                  getProjectDetail={getProjectDetail}
                />
              </TabPanel>
            </Tabs>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default AddProjectDev;
