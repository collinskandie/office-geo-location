const fs = require("fs");
const path = require("path");

// Specify the folder path where the images are located
const folderPath = path.join(__dirname, "../uploads/patients/");

function saveBase64Image(base64Image) {
  const imageData = base64Image.replace(/^data:image\/jpeg;base64,/, "");
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  //   const folderPath =

  // Create the directory if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, `${timestamp}.jpeg`);
  const imageBuffer = Buffer.from(imageData, "base64");

  fs.writeFileSync(filePath, imageBuffer);

  //uploadFileToS3(s3Location, imageBuffer, s3LocationPath);

  console.log("Image saved successfully:", filePath);

  return `${timestamp}.jpeg`;
}

// function saveFile(file) {
//   fs.readdir(folderPath, (err, files) => {
//     if (err) {
//       console.error("Error reading folder:", err);
//       return;
//     }

//     // Filter out only image files (you can customize this regex as needed)
//     const imageFiles = files.filter((file) =>
//       /\.(jpg|jpeg|png|gif)$/i.test(file)
//     );

//     // Rename the image files
//     imageFiles.forEach((file, index) => {
//       const oldPath = path.join(folderPath, file);
//       const extension = path.extname(file);
//       const newName = `image${index + 1}${extension}`;
//       const newPath = path.join(folderPath, newName);

//       fs.rename(oldPath, newPath, (renameErr) => {
//         if (renameErr) {
//           console.error(`Error renaming ${file}:`, renameErr);
//         } else {
//           console.log(`Renamed ${file} to ${newName}`);
//         }
//       });
//     });
//   });
// }

module.exports = {
  saveBase64Image,
  // saveFile,
};
