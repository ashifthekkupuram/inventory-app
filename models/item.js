import mongoose,{Schema} from "mongoose";

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 150,
    },
    description: {
        type: String,
    },
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    price: {
        type: Number,
        required: true,
    }
})

ItemSchema.virtual('url').get(function (){
    return `/item/${this._id}/`
})

export default mongoose.model('Item',ItemSchema)