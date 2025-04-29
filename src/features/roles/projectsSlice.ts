/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl"




interface Project {
    id: number;
    name: string;
    date_added: string;
}


const apiUrl = getApiUrl()
// Define the allowed values for status
type Status = "idle" | "loading" | "succeeded" | "failed";

// Extend the RolesState interface
interface ProjectsState {
    projects: Project[];
    status: Status; // For general actions like fetching roles
    error: string | null | undefined; // General error state
    productExists: boolean; // To track if a project already exists


    fetchProjectStatus: Status;
    fetchProjectError: string | null | undefined;

    addProjectStatus: Status;
    addProjectError: string | null | undefined;

    newlyCreatedProject: string | null | undefined;
}

// Define the initial state according to the updated interface
const initialState: ProjectsState = {
    projects: [],
    status: "idle", // Default general status
    error: null, // Default error state
    productExists: false, // Default state for project existence



    fetchProjectStatus: 'idle',
    fetchProjectError: null,

    addProjectStatus: 'idle',
    addProjectError: null,

    newlyCreatedProject: null,

};


export const fetchProject = createAsyncThunk("roles/fetchProjects", async () => {
    const response = await axios.get<Project[]>(`${apiUrl}/projects/`);
    return response.data;
});


export const addProject = createAsyncThunk("project/addProject", async (formData) => {
    const response = await axios.post(`${apiUrl}/create-project/`, formData)
    return response.data;
})

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        resetAddProjectStatus: (state) => {
            state.addProjectStatus = 'idle';
          },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchProject.pending, (state) => {
                state.fetchProjectStatus = 'loading';
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.fetchProjectStatus = 'succeeded'
                state.projects = action.payload
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.fetchProjectError = action.error.message
            })
            .addCase(addProject.pending, (state) => {
                state.addProjectStatus = 'loading';
            })
            .addCase(addProject.fulfilled, (state, action) => {
                state.addProjectStatus = 'succeeded'
                state.projects = [ ...state.projects ,action.payload]
                state.newlyCreatedProject = action.payload;
            })
            .addCase(addProject.rejected, (state, action) => {
                state.addProjectError = action.error.message
            })

    },
});

export const selectAllProjects = (state: { projects: ProjectsState }) => state.projects.projects;
export const getProjectStatus = (state: { projects: ProjectsState }) => state.projects.status;
export const getProjectError = (state: { projects: ProjectsState }) => state.projects.error;

export const { resetAddProjectStatus } = projectsSlice.actions;
export default projectsSlice.reducer;
