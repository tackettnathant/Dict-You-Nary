import {RETRIEVE_ALL_ENTRIES} from "../constants/actions";
import DB from '../db';
const initialState = {
    entries:[]
}

const rootReducer = (state,action) =>{

    switch (action.type) {
        case RETRIEVE_ALL_ENTRIES:
            return {...state,entries:DB.retrieveAll()};
        case RETRIEVE_ENTRY:
            
        default:
            return state;
    }
}

export default rootReducer;
