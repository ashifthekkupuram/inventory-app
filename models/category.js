import mongoose,{Schema} from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 150,
    },
    description: {
        type: String,
    },
})

CategorySchema.virtual('url').get(function (){
    return `/category/${this._id}/`
})

export default mongoose.model('Category', CategorySchema)