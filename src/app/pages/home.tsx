import {View,StyleSheet,Text,FlatList,Pressable} from "react-native"
import { useState ,useCallback} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import  {Folder,Plus,UserRound} from "lucide-react-native"
import { type Note } from "@/types/notes"
import {router,useFocusEffect} from "expo-router"

export default function Home(){
    const [notes,setNotes]=useState<Note[]>([])

    //gets all saved notes 
    const getNotes=async()=>{
        try{
            const dataNotes=await AsyncStorage.getItem("notes")

            if(dataNotes!==null){
                setNotes(JSON.parse(dataNotes))
            }
            else{
                setNotes([])
            }
            
        }
        catch(error){
            console.log(error)
        }
    }

    //mounts whenever the page is opened
    useFocusEffect(
        useCallback(()=>{
            getNotes()
         } ,[])
    )

    //store the categories created by the user
    const categories:string[]=[]
 // Get the categories from saved notes
notes.forEach((note) => {
    const category = note.category.trim()

    // Prevent duplicate categories
    if (category !== "" && !categories.some((item) =>
        item.toLowerCase() === category.toLowerCase())) {
        categories.push(category)
    }
})
}

