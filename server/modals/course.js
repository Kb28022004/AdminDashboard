

const mongoose=require('mongoose')

const courseSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide course name']
    },
    instructor:{
        type:String,
        required:[true,'please provide instructor name']
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},
    createdAt: { type: Date, default: Date.now },
})

module.exports=mongoose.model('Course',courseSchema)