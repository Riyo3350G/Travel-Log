import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const locationSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: [String], required: true },
    long: { type: Number, required: true },
    lat: { type: Number, required: true },
});

locationSchema.statics.createLocation = async function(userId, name, category, description, image, long, lat) {
    const location = await this.create({
        userId,
        name,
        category,
        description,
        image,
        long,
        lat,
    }); 
    return location;
};

locationSchema.statics.getLocations = async function() {
    const locations = await this.find();
    return locations;
}

locationSchema.statics.getLocation = async function(locationId) {
    const location = await this.findById(locationId);
    return location;
}

locationSchema.statics.findByUserId = async function(userId) {
    const locations = await this.find({ userId });
    return locations;

}

locationSchema.statics.deleteLocation = async function(locationId) {
    const location = await this.findByIdAndDelete(locationId);
    return location;
}

const Location = Mongoose.model("Location", locationSchema);
export default Location;
