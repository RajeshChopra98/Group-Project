import { Project } from "../models/project.model.js";
import { errorHandler } from "../utils/error.js";
import { uploadToFirebase } from "../utils/uploadToFirebase.js";


// To create a new group....
export const createNewProject = async (req, res, next) => {
    try {
        const { projectname, description, soccsvalue, membercount, type, group_name, group_id, remote,
            latitude, longitude, address, city, state, zip, country
        } = req.body;


        let adminOfProject = req.user?._id;

        let group = await Gr

        if ([projectname, description, soccsvalue, membercount, type, group_name, group_id, remote,
            latitude, longitude, address, city, state, zip, country].some((field) => field?.trim() === "")) {
            return next(errorHandler(400, "Please provide all fields!"));
        }

        const project = await Project.findOne({ projectname: projectname.trim().toLowerCase() });

        if (project) return next(errorHandler(409, `Project with name ${projectname} Already Exists`));

        const projectImagePath = req.file?.path;

        if (!projectImagePath) return next(errorHandler(400, "Project Image is required!"));

        const uploadedphoto = await uploadToFirebase(projectImagePath, req.file?.mimetype, "projects");

        if (!uploadedphoto) return next(errorHandler(500, "Failed to upload Image!"));

        let newProject = await Project.create({
            projectname, description, soccsvalue, membercount, type, group_name,
            group_id, remote,
            latitude, longitude, address, city, state, zip, country
        });

        if (!groupData) return next(errorHandler(404, "Group does not exists!"));

        res.status(200).json({
            success: true,
            message: "Group created successfully!",
            groupData: groupData
        });

    } catch (error) {
        return next(errorHandler(500, error.message || "Error while creating a new group"));
    }
};


