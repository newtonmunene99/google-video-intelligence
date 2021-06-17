import { VideoIntelligenceServiceClient } from "@google-cloud/video-intelligence";

// Create a new Video intelligence service client
// const client = new VideoIntelligenceServiceClient({
//   // Google cloud platform project id
//   projectId: "pitstop-1531897526190",
//   // Path to your credentials json file
//   keyFilename: "credentials.json",
// });
const client = new VideoIntelligenceServiceClient({
  // Google cloud platform project id
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
});

/**
 *
 * @param {string | Uint8Array} inputContent
 * @returns
 */
export const annotateVideoWithLabels = async (inputContent) => {
  // Grab the operation using array destructuring. The operation is the first object in the array.
  const [operation] = await client.annotateVideo({
    // Input content
    inputContent: inputContent,
    // Video Intelligence features
    features: ["LABEL_DETECTION"],
    // Options for context of the video being analyzed
    videoContext: {
      // Options for the label detection feature
      labelDetectionConfig: {
        labelDetectionMode: "SHOT_AND_FRAME_MODE",
        stationaryCamera: true,
        frameConfidenceThreshold: 0.6,
        videoConfidenceThreshold: 0.6,
      },
    },
  });

  const [operationResult] = await operation.promise();

  // Gets annotations for video
  const annotations = operationResult.annotationResults[0];

  return annotations;
};
