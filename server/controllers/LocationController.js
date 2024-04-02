import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import mime from "mime-types";
import User from "../models/userModel.js";
import Location from "../models/locationModel.js";

class LocationController {
  static async postLocation(req, res) {
    const { userId, name, category, description, image, long, lat } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    }
    if (!category) {
      return res.status(400).json({ error: "Missing category" });
    }
    if (!description) {
      return res.status(400).json({ error: "Missing description" });
    }
    if (!image) {
      return res.status(400).json({ error: "Missing image" });
    }
    if (!long) {
      return res.status(400).json({ error: "Missing longtitude" });
    }
    if (!lat) {
      return res.status(400).json({ error: "Missing latitude" });
    }
    const filePath = process.env.FOLDER_PATH || "./images/";
    try {
      await fs.mkdir(filePath);
    } catch (error) {
      if (error.code !== "EEXIST") {
        return res.status(500).json({ error: "Error creating folder" });
      }
    }
    let imagesPath = [];
    const writeFilesPromises = image.map(async (img) => {
      // Use map instead of forEach for Promise.all
      const base64 = img;

      // Extract MIME type from the base64 string
      const mimeTypeMatch = base64.match(/^data:(.*?);base64,/);
      if (!mimeTypeMatch) {
        console.error("Could not determine MIME type from base64 string.");
        return null; // Return null or similar to indicate failure
      }
      const mimeType = mimeTypeMatch[1];

      // Get the extension for the MIME type
      const extension = mime.extension(mimeType);
      if (!extension) {
        console.error("Could not determine file extension.");
        return null; // Return null or similar to indicate failure
      }

      // Convert base64 string to Buffer, skipping the data URL scheme part
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Create filename and filePath
      const filename = `${uuidv4()}.${extension}`;
      const filePath = `./images/${filename}`;

      // Write the file and return the filePath to add it to imagesPath later
      try {
        await fs.writeFile(filePath, buffer);
        return filePath; // Return filePath to be collected
      } catch (error) {
        console.error("Error writing file:", error);
        return null; // Return null or similar to indicate failure
      }
    });

    // Wait for all file write operations to complete
    Promise.all(writeFilesPromises)
      .then(async (paths) => {
        // Filter out any null values (failed operations) and add successful paths to imagesPath
        imagesPath = paths.filter((path) => path != null);

        // Proceed with creating the location
        try {
          const location = await Location.createLocation(
            userId,
            name,
            category,
            description,
            imagesPath,
            long,
            lat
          );
          if (!location) {
            return res.status(500).json({ error: "Error creating location" });
          }
          res.status(201).json({ location });
        } catch (error) {
          console.error("Error creating location:", error);
          res.status(500).json({ error: "Error creating location" });
        }
      })
      .catch((error) => {
        console.error("Error in file writing or location creation:", error);
      });
  }

  static async getLocations(req, res) {
    try {
      const locations = await Location.find();
      if (!locations || locations.length === 0) {
        return res.status(404).json({ error: "Locations not found" });
      }

      // Map over locations and transform them asynchronously
      const modifiedLocations = await Promise.all(
        locations.map(async (location) => {
          let loc = {
            id: location._id,
            userId: location.userId,
            name: location.name,
            category: location.category,
            description: location.description,
            long: location.long,
            lat: location.lat,
          };

          // Wait for all images to be read and base64 encoded
          const images = await Promise.all(
            location.image.map(async (imagePath) => {
              const base64 = await fs.readFile(imagePath, {
                encoding: "base64",
              });
              return `data:image/jpeg;base64,${base64}`;
            })
          );

          loc.image = images;
          return loc;
        })
      );

      res.status(200).json({ modifiedLocations });
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Error fetching locations" });
    }
  }

  static async getLocation(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing location id" });
    }
    try {
      const location = await Location.findById(id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      let loc = {
        id: location._id,
        userId: location.userId,
        name: location.name,
        category: location.category,
        description: location.description,
        long: location.long,
        lat: location.lat,
      };
      const images = await Promise.all(
        location.image.map(async (imagePath) => {
          const base64 = await fs.readFile(imagePath, { encoding: "base64" });
          return `data:image/jpeg;base64,${base64}`;
        })
      );
      loc.image = images;
      res.status(200).json({ loc });
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ error: "Error fetching location" });
    }
  }

  static async getLocationsByUserId(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing userId" });
    }
    try {
      const locations = await Location.findByUserId(id);
      if (!locations || locations.length === 0) {
        return res.status(404).json({ error: "Locations not found" });
      }
      const modifiedLocations = await Promise.all(
        locations.map(async (location) => {
          let loc = {
            id: location._id,
            userId: location.userId,
            name: location.name,
            category: location.category,
            description: location.description,
            long: location.long,
            lat: location.lat,
          };
          const images = await Promise.all(
            location.image.map(async (imagePath) => {
              const base64 = await fs.readFile(imagePath, {
                encoding: "base64",
              });
              return `data:image/jpeg;base64,${base64}`;
            })
          );
          loc.image = images;
          return loc;
        })
      );
      res.status(200).json({ modifiedLocations });
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Error fetching locations" });
    }
  }

  static async putLocation(req, res) {
    const { id } = req.params;
    const { name, category, description, image, long, lat } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing location id" });
    }
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    if (name) {
      location.name = name;
    }
    if (category) {
      location.category = category;
    }
    if (description) {
      location.description = description;
    }
    if (image) {
      const filePath = process.env.FOLDER_PATH || "./images/";
      try {
        await fs.mkdir(filePath);
      } catch (error) {
        if (error.code !== "EEXIST") {
          return res.status(500).json({ error: "Error creating folder" });
        }
      }
      let imagesPath = [];
      const writeFilesPromises = image.map(async (img) => {
        // Use map instead of forEach for Promise.all
        const base64 = img;

        // Extract MIME type from the base64 string
        const mimeTypeMatch = base64.match(/^data:(.*?);base64,/);
        if (!mimeTypeMatch) {
          console.error("Could not determine MIME type from base64 string.");
          return null; // Return null or similar to indicate failure
        }
        const mimeType = mimeTypeMatch[1];

        // Get the extension for the MIME type
        const extension = mime.extension(mimeType);
        if (!extension) {
          console.error("Could not determine file extension.");
          return null; // Return null or similar to indicate failure
        }

        // Convert base64 string to Buffer, skipping the data URL scheme part
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Create filename and filePath
        const filename = `${uuidv4()}.${extension}`;
        const filePath = `./images/${filename}`;

        // Write the file and return the filePath to add it to imagesPath later
        try {
          await fs.writeFile(filePath, buffer);
          return filePath; // Return filePath to be collected
        } catch (error) {
          console.error("Error writing file:", error);
          return null; // Return null or similar to indicate failure
        }
      });

      // Wait for all file write operations to complete
      Promise.all(writeFilesPromises)
        .then(async (paths) => {
          // Filter out any null values (failed operations) and add successful paths to imagesPath
          imagesPath = paths.filter((path) => path != null);
          location.image = imagesPath;
        })
        .catch((error) => {
          console.error("Error in file writing or location creation:", error);
        });
    }
  }

  static async deleteLocation(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing location id" });
    }
    const location = await Location.findById(id);
    if(!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    try {
      await Location.deleteLocation(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ error: "Error deleting location" });
    }
  }    
}

export default LocationController;
