import React from 'react';
import { AsyncStorage } from 'react-native';
import uuid from 'react-native-uuid';
import Util from './utils'
class DB {
    static async insertOrUpdate(entry){
        try {
            //console.log(entry);
            let newEntry = {...entry,key:entry.key||uuid.v1()};
            await AsyncStorage.setItem(newEntry.key,JSON.stringify(newEntry));
            return newEntry;
        } catch (error) {
            throw new Error("Unable to save.");
        }

    }
    static async retrieve(id){
        //TODO: Realistic error handling
        try {
            let response = await AsyncStorage.getItem(id);
            let entry = await JSON.parse(response) || null;
            return entry;
        } catch (error){
            throw new Error("Unable to retrieve.");
        }

    }
    static async retrieveAll() {
        try {
            let keys = await AsyncStorage.getAllKeys();
            if (!keys) {
                return [];
            }
            let response = await AsyncStorage.multiGet(keys);
            let entries;
            if (response) {
                entries = response.map((entry)=>JSON.parse(entry[1])).sort(Util.sortByWord);
            } else {
                entries=[];
            }
            return entries;
        } catch (error) {
            throw new Error("Unable to retieve entries. " + error.message);
        }
    }
    static async delete(id) {
        try{
            await AsyncStorage.removeItem(id);
        } catch (error) {
            throw new Error("Unable to delete.");
        }
    }
    static async deleteAll() {
        try {
            let keys = await AsyncStorage.getAllKeys();
            if (!keys) {
                return;
            }
            await AsyncStorage.multiRemove(keys);

        } catch (error) {
            throw new Error("Unable to remove entries. " + error.message);
        }
    }
}

export default DB;
