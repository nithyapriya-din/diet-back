import mongoose from "mongoose";



const appUserSchema = new mongoose.Schema({
    id: {
        type: 'string',
        require: true,
    },
    Firstname: {
        type: 'string',
        require: true,
    },
    Lastname: {
        type: 'string',
        require: true,
    },
   
    Gender: {
        type: 'string',
        require: true,
    },
   

    email: {
        type: 'string',
        require: true,
    },
    password: {

        type: 'string',
        require: true,
    },
    isVerified:{

        type: 'string',
        require: true,
    },
    ResetKey: {
        type: 'string',
        require: true,
    },
    Height: {
        type: 'string',
        require: true,
    },
    Weight: {
        type: 'string',
        require: true,
    },
    Age: {
        type: 'string',
        require: true,
    },
   

});

export const AppUserModel = mongoose.model('app-users ', appUserSchema);

const WeightLossSchema = new mongoose.Schema({
    day: String,
    mealTime: String,
    food: String,
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
  });

export const WeightLoss = mongoose.model('DiatForWeightLoss',WeightLossSchema);




const WeightGainSchema = new mongoose.Schema({
    day: String,
    mealTime: String,
    food: String,
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
  });

export const WeightGain = mongoose.model('DiatForWeightGain',WeightGainSchema);


const TamilWeightGainSchema = new mongoose.Schema({
    day: String,
    mealTime: String,
    food: String,
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
  });

export const TamilWeightGain = mongoose.model('TamilDiatForWeightGain',TamilWeightGainSchema);

const TamilWeightLossSchema = new mongoose.Schema({
    day: String,
    mealTime: String,
    food: String,
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
  });

export const TamilWeightLoss = mongoose.model('TamilDiatForWeightLoss',TamilWeightLossSchema);