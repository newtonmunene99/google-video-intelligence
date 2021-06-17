// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { promises as fs } from "fs";
import { annotateVideoWithLabels } from "../../lib/google";
import cloudinary from "../../lib/cloudinary";

const videosController = async (req, res) => {
  // Check the incoming http method. Handle the POST request method and reject the rest.
  switch (req.method) {
    // Handle the POST request method
    case "POST": {
      try {
        const result = await handlePostRequest();

        // Respond to the request with a status code 201(Created)
        return res.status(201).json({
          message: "Success",
          result,
        });
      } catch (error) {
        // In case of an error, respond to the request with a status code 400(Bad Request)
        return res.status(400).json({
          message: "Error",
          error,
        });
      }
    }
    // Reject other http methods with a status code 405
    default: {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  }
};

const handlePostRequest = async () => {
  // Path to the file you want to upload
  const pathToFile = "public/videos/house.mp4";

  // Upload your file to cloudinary
  const uploadResult = await handleCloudinaryUpload(pathToFile);

  // Read the file using fs. This results in a Buffer
  const file = await fs.readFile(pathToFile);

  // Convert the file to a base64 string in preparation of analysing the video with google's video intelligence api
  const inputContent = file.toString("base64");

  // Analyze the video using Google's video intelligence api
  const annotations = await annotateVideoWithLabels(inputContent);

  // Return an object with the cloudinary upload result and the video analysis result
  return { uploadResult, annotations };
};

const handleCloudinaryUpload = (path) => {
  // Create and return a new Promise
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        // Folder to store video in
        folder: "videos/",
        // Type of resource
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          // Reject the promise with an error if any
          return reject(error);
        }

        // Resolve the promise with a successful result
        return resolve(result);
      }
    );
  });
};

export default videosController;
