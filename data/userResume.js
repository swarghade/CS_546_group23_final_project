// const { users } = require('../config/mongoCollections');
const mongoCollections = require('../config/mongoCollections');
const userResume = mongoCollections.userResume;
const users = require('./users');
const objectId = require('mongodb').ObjectID;

function checkUndef(variable, variableName)
{
    if (variable === null || variable === undefined)
    {
        throw `${variableName || 'Provided Variable'} is not defined!`
    }
}

let exportedMethods = {

    async addResume(education, skills, description, userResumeUrl, workStatus,yearsOfExperience, resumeActive) {

        const resumeCollection = await userResume();
    
        const newResume = {
          education: education,//array_of_objects
          // workExperience: [],//array_of_objects,sub document (Removed Because wrong Cardinality)
          projects: [],//array_of_object,sub document
          skills: skills,//array_of_skills
          workStatus:workStatus,
          yearsOfExperience: yearsOfExperience,
          description:description,
          resumeActive:resumeActive,
          userResumeUrl:userResumeUrl
        };
        // userId = mongodb.ObjectId(userId)
    
        const newInsertInformation = await resumeCollection.insertOne(newResume);
        // const newId = newInsertInformation.insertedId;
        // await users.addResumeToUser(userId, newResume);
        console.log("Added Resume")
        return newResume
    },

    async addProjectToUserResume(resumeId, newProject) {
      checkUndef(resumeId, "resumeId");
      checkUndef(newProject, "newProject");
      
      // let currentUser = await this.getUserById(resumeId);
      // const userCollection = await users();
      const resumeCollection = await userResume();
  
      const updateInfo = await resumeCollection.updateOne(
        { _id: resumeId },
        { $addToSet: { projects: newProject } }
      );
  
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw 'Update failed';
  
      return await this.getResumeById(resumeId);
    },

    async getResumeById(id)
    {
      checkUndef(id, "id");

      const resumeCollection = await userResume();
      const resume = await resumeCollection.findOne({ _id: objectId(id) });

      if (!resume) throw `Resume with the given ID: ${id} not found!`;
      return resume;
    },

    async removeResume(id)
    {
      const resumeCollection = await userResume();
      let resume = null;

      try
      {
        resume = await this.getResumeById(id);
      }
      catch(e)
      {
        console.log(e);
        return;
      }

      let temp = resume._id;

      const deletionInfo = await resumeCollection.removeOne({ _id: objectId(id) });
      if (deletionInfo.deletedCount == 0) throw `Could not delete resume with the ID of ${id}`;

      await users.removeResumeFromUser(temp)
      obj = {"resumeId": temp, "deleted": true};
      return obj;
    },

    async getAllResumes()
    {
      const resumeCollection = await userResume()
      const resumeList = await resumeCollection.find({}).toArray();

      if (!resumeList) throw `No resumes found!`;
      return resumeList;
    },

    async updateResume()
    {

    },
// Data Functions for Search Page
    async searchResumeByYearSkills(years,skillsArray)
    {
      checkUndef(years, "years");
      checkUndef(skillsArray,"skillsArray");
      const resumeCollection = await userResume()
      const resumeList = await resumeCollection.find({$and: [{ skills: { $in: skillsArray}}, { yearsOfExperience: { $gte: years} }, { resumeActive : true}]}).toArray();
      // console.log(resumeList)
      return resumeList
    }
}

module.exports = exportedMethods