import { doc, getDoc, updateDoc, collection, getDocs, query, where, setDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { createContext , useState, useEffect } from "react";
import { auth, db, getMessages, initializeConversation } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const   AppContextProvider = (props) => {

    const navigate = useNavigate();
    const [userData,setUserData] = useState(null);
    const [chatData,setChatData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Set up real-time message listener when messagesId changes
    useEffect(() => {
        if(messagesId && selectedUser) {
            const unsubscribe = getMessages(messagesId, (msgList) => {
                setMessages(msgList || []);
            });
            return () => {
                if(unsubscribe) unsubscribe();
            };
        }
    }, [messagesId, selectedUser]);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db,'users',uid)
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);
            if(userData.avatar && userData.name){
                navigate('/chat');
                // Load chats
                await loadChats(uid);
            }
            else{
                navigate('/profile');
            }

            await updateDoc(userRef,{
                lastSeen:Date.now()
            })
            setInterval(async()=>{
                if(auth.currentUser){
                     await updateDoc(userRef,{
                lastSeen:Date.now()
            })
                }

            },60000);
        } catch (error) {
            console.error(error);
        } 
    }

    const loadChats = async (uid) => {
        try {
            const chatRef = doc(db,'chats',uid);
            const chatSnap = await getDoc(chatRef);
            const chatData = chatSnap.data();
            setChatData(chatData);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchAllUsers = async () => {
        try {
            const usersRef = collection(db, 'users');
            const snapshot = await getDocs(usersRef);
            const users = [];
            snapshot.forEach(doc => {
                if(doc.data().id !== auth.currentUser?.uid) {
                    users.push(doc.data());
                }
            });
            setAllUsers(users);
        } catch (error) {
            console.error(error);
        }
    }

    const sendMessage = async (text, image = null) => {
        try {
            if(!text && !image) return;
            
            const timestamp = Date.now();
            const messageData = {
                sId: auth.currentUser?.uid,
                text: text,
                image: image || "",
                timestamp: timestamp
            };

            // Add message to messages collection
            if(messagesId) {
                const msgRef = doc(db, 'messages', messagesId);
                const msgSnap = await getDoc(msgRef);
                
                if(msgSnap.exists()) {
                    await updateDoc(msgRef, {
                        messages: arrayUnion(messageData)
                    });
                } else {
                    // Create new message document if not exists
                    await setDoc(msgRef, {
                        messages: [messageData]
                    });
                }
            }

            // Update chat data for both users
            if(selectedUser?.id) {
                // Create a unique chat key
                const chatKey = [auth.currentUser?.uid, selectedUser?.id].sort().join('_');
                
                // Update sender's chat
                const senderChatRef = doc(db, 'chats', auth.currentUser?.uid);
                const senderSnap = await getDoc(senderChatRef);
                
                if(senderSnap.exists() && senderSnap.data().chatData) {
                    // Check if chat already exists
                    const existingChat = senderSnap.data().chatData.find(c => c.rId === selectedUser.id);
                    if(existingChat) {
                        await updateDoc(senderChatRef, {
                            ['chatData']: senderSnap.data().chatData.map(c => 
                                c.rId === selectedUser.id 
                                    ? {...c, lastMessage: text || "Image", updatedAt: timestamp}
                                    : c
                            )
                        });
                    } else {
                        await updateDoc(senderChatRef, {
                            chatData: arrayUnion({
                                rId: selectedUser.id,
                                lastMessage: text || "Image",
                                updatedAt: timestamp
                            })
                        });
                    }
                }

                // Update receiver's chat
                const receiverChatRef = doc(db, 'chats', selectedUser.id);
                const receiverSnap = await getDoc(receiverChatRef);
                
                if(receiverSnap.exists() && receiverSnap.data().chatData) {
                    const existingChat = receiverSnap.data().chatData.find(c => c.rId === auth.currentUser?.uid);
                    if(existingChat) {
                        await updateDoc(receiverChatRef, {
                            ['chatData']: receiverSnap.data().chatData.map(c => 
                                c.rId === auth.currentUser?.uid 
                                    ? {...c, lastMessage: text || "Image", updatedAt: timestamp}
                                    : c
                            )
                        });
                    } else {
                        await updateDoc(receiverChatRef, {
                            chatData: arrayUnion({
                                rId: auth.currentUser?.uid,
                                lastMessage: text || "Image",
                                updatedAt: timestamp
                            })
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    }

    const value = {
        userData,setUserData,
        chatData,setChatData,
        loadUserData,
        loadChats,
        allUsers,
        fetchAllUsers,
        messagesId,
        setMessagesId,
        messages,
        setMessages,
        selectedUser,
        setSelectedUser,
        sendMessage
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>

    )

}

export default AppContextProvider