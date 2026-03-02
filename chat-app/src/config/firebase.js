// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc , doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import {toast} from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvs1YqBYF3wgI9czpdeJxjPPRWThcZSF8",
  authDomain: "chat-app-d042d.firebaseapp.com",
  projectId: "chat-app-d042d",
  storageBucket: "chat-app-d042d.firebasestorage.app",
  messagingSenderId: "252378102759",
  appId: "1:252378102759:web:82ff634f4860dd59b95b42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async(username , email , password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        console.log("Signup successful:", user.email);
        await setDoc(doc(db,"users",user.uid), {
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio: "Hey, There i am using Chat app",
            lastSeen: Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
        return res;
    } catch (error) {
        console.error("Signup error:", error);
        let errorMessage = "Signup failed";
        if(error.code) {
            errorMessage = error.code.split('/')[1].split('-').join(" ");
        }
        toast.error(errorMessage);
        throw error;
    }
    
}

const login = async(email , password) => {
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async() => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
    
}

// Function to get messages between two users
export const getMessages = (conversationId, callback) => {
    try {
        const messageRef = doc(db, 'messages', conversationId);
        const unsubscribe = onSnapshot(messageRef, (doc) => {
            if(doc.exists()) {
                callback(doc.data().messages || []);
            } else {
                callback([]);
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return () => {};
    }
}

// Function to initialize or get conversation
export const initializeConversation = async (userId1, userId2) => {
    try {
        const conversationId = [userId1, userId2].sort().join('_');
        
        // Check if conversation exists
        const msgRef = doc(db, 'messages', conversationId);
        const msgSnap = await onSnapshot(msgRef, (doc) => {
            if(!doc.exists()) {
                // Create new conversation document
                setDoc(msgRef, { messages: [] }).catch(err => console.log(err));
            }
        });
        
        return conversationId;
    } catch (error) {
        console.error("Error initializing conversation:", error);
    }
}

export {signup,login,logout,auth,db}