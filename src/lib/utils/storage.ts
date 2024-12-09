import { ref, uploadBytes, getDownloadURL } from "firebase/storage";  
import { storage } from "@/lib/utils/firebase-admin"; // Adjust the path to your Firebase initialization file  

export async function uploadToStorage(file: File) {  
  try {  
    // Create a reference to the file in Firebase Storage  
    const fileName = `${Date.now()}-${file.name}`;  
    const fileRef = ref(storage, `uploads/${fileName}`); // Store files in the "uploads" folder  

    // Upload the file to Firebase Storage  
    const snapshot = await uploadBytes(fileRef, file, {  
      contentType: file.type, // Set the content type (e.g., image/jpeg)  
    });  

    // Get the public URL of the uploaded file  
    const url = await getDownloadURL(snapshot.ref);  

    return {  
      url, // The public URL of the uploaded file  
      thumbnail: url, // You can generate a thumbnail if needed  
    };  
  } catch (error) {  
    console.error("Error uploading to Firebase Storage:", error);  
    throw new Error("Failed to upload file");  
  }  
}  