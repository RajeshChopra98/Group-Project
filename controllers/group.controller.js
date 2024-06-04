import { Group  } from "../models/group.model.js";
import { errorHandler } from "../utils/error.js";
import { uploadToFirebase } from "../utils/uploadToFirebase.js";


// To create a new group....
export const createNewGroup = async (req, res, next) => {
    try {
      const { name } = req.body;
      let adminOfGroup = req.user?._id;
  
      if (!name) {
        return next(errorHandler(400, "Please provide the name of the group!"));
      }
  
      const group = await Group.findOne({ name: name.trim().toLowerCase() });
  
      if (group) return next(errorHandler(409, `Group with name ${name} Already Exists`));
  
      const groupLogoPath = req.file?.path;
  
      if (!groupLogoPath) return next(errorHandler(400, "Logo is required!"));
  
      const uploadedphoto = await uploadToFirebase(groupLogoPath,req.file?.mimetype,"groups");
  
      if (!uploadedphoto) return next(errorHandler(500, "Failed to upload Image!"));
      
      let groupData = await Group.create({
        name : name.trim().toLowerCase(),
        logo: {
          url : uploadedphoto?.url,
          publicId : uploadedphoto?.publicId
        },
        createdBy : adminOfGroup
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


// To Update a group's status....
export const updateGroupStatus = async (req, res, next) => {
  try {
    const groupId = req.query.id;
    const { status } = req.body;
    const currentLoggedInUser = req.user?._id;

    if (!groupId) {
      return next(errorHandler(400, "Please provide Id of the group!"));
    }

    if (!status || !["pending", "accepted", "rejected"].includes(status)) {
      return next(errorHandler(400, "Please provide a valid status!"));
  }

    const group = await Group.findById(groupId);

    if (!group) return next(errorHandler(409, `Group does not exist`));

    if(String(group.createdBy) !== String(currentLoggedInUser)) return next(errorHandler(401, `Only Group's Admin is allowed to update the status!`));

    group.status = status;
    await group.save();

    let allGroups = await Group.find({});

     res.status(200).json({
        success: true,
        message: "Group's status updated successfully!",
        groups: allGroups
    });

  } catch (error) {
    return next(errorHandler(500, error.message || "Error while updating group's status"));
  }
};



