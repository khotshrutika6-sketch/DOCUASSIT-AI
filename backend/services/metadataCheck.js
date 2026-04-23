import fs from "fs";
import ExifParser from "exif-parser";

export async function checkMetadata(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const parser = ExifParser.create(buffer);
    const result = parser.parse();

    const issues = [];

    // Check for software used to modify images
    const software = result.tags.Software;
    if (software && (software.toLowerCase().includes("photoshop") || software.toLowerCase().includes("gimp"))) {
      issues.push("image_editing_software_detected");
    }

    if (!result.tags.CreateDate && !result.tags.DateTimeOriginal) {
      issues.push("missing_original_timestamps");
    }

    return { 
      issues, 
      device: result.tags.Make || "Unknown",
      software: software || "Native",
      raw: result.tags 
    };

  } catch (error) {
    // PDF or files without EXIF often end up here
    return { issues: ["no_metadata_found"], raw: {}, software: "System" };
  }
}
