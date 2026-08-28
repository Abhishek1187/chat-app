import { doc, getDoc, updateDoc, collection, query, where, setDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { auth, db, getMessages } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Set up real-time message listener when messagesId changes
    useEffect(() => {
        if (messagesId && selectedUser) {
            const unsubscribe = getMessages(messagesId, (msgList) => {
                setMessages(msgList || []);
            });
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [messagesId, selectedUser]);

    // Set up presence tracking and real-time chats list updates when userData is loaded
    useEffect(() => {
        if (!userData?.id) {
            setChatData(null);
            return;
        }

        const userRef = doc(db, 'users', userData.id);

        // Update presence immediately
        updateDoc(userRef, { lastSeen: Date.now() }).catch(console.error);

        // Periodically update presence every 60 seconds
        const intervalId = setInterval(async () => {
            if (auth.currentUser) {
                await updateDoc(userRef, { lastSeen: Date.now() }).catch(console.error);
            }
        }, 60000);

        // Set up real-time chats listener
        const chatRef = doc(db, 'chats', userData.id);
        const unsubscribeChats = onSnapshot(chatRef, async (chatSnap) => {
            if (chatSnap.exists()) {
                const rawData = chatSnap.data();
                const rawChatList = rawData.chatData || [];

                // Hydrate each chat with recipient profile data
                const hydratedChats = await Promise.all(
                    rawChatList.map(async (chatItem) => {
                        const userSnap = await getDoc(doc(db, 'users', chatItem.rId));
                        return {
                            ...chatItem,
                            userData: userSnap.exists() ? userSnap.data() : null
                        };
                    })
                );

                // Sort chats by updatedAt (most recent message first)
                hydratedChats.sort((a, b) => b.updatedAt - a.updatedAt);

                setChatData({ ...rawData, chatData: hydratedChats });
            }
        }, (error) => {
            console.error("Error listening to chats:", error);
        });

        return () => {
            clearInterval(intervalId);
            unsubscribeChats();
        };
    }, [userData?.id]);

    // Set up real-time listener for selectedUser profile updates (presence, avatar changes, etc.)
    useEffect(() => {
        if (selectedUser?.id) {
            const userRef = doc(db, 'users', selectedUser.id);
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    setSelectedUser(docSnap.data());
                }
            });
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [selectedUser?.id]);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const data = userSnap.data();
            setUserData(data);

            if (data?.avatar && data?.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    const sendMessage = async (text, image = null) => {
        try {
            if (!text && !image) return;

            const timestamp = Date.now();
            const messageData = {
                sId: auth.currentUser?.uid,
                text: text,
                image: image || "",
                timestamp: timestamp
            };

            if (messagesId) {
                const msgRef = doc(db, 'messages', messagesId);
                const msgSnap = await getDoc(msgRef);

                if (msgSnap.exists()) {
                    await updateDoc(msgRef, {
                        messages: arrayUnion(messageData)
                    });
                } else {
                    await setDoc(msgRef, {
                        messages: [messageData]
                    });
                }
            }

            if (selectedUser?.id) {
                const updateParticipantChat = async (userId, recipientId) => {
                    const userChatRef = doc(db, 'chats', userId);
                    const userChatSnap = await getDoc(userChatRef);

                    if (userChatSnap.exists() && userChatSnap.data().chatData) {
                        const existingList = userChatSnap.data().chatData;
                        const existingChatIndex = existingList.findIndex(c => c.rId === recipientId);

                        if (existingChatIndex > -1) {
                            existingList[existingChatIndex].lastMessage = text || "Image";
                            existingList[existingChatIndex].updatedAt = timestamp;
                            await updateDoc(userChatRef, { chatData: existingList });
                        } else {
                            await updateDoc(userChatRef, {
                                chatData: arrayUnion({
                                    rId: recipientId,
                                    lastMessage: text || "Image",
                                    updatedAt: timestamp
                                })
                            });
                        }
                    }
                };

                await updateParticipantChat(auth.currentUser?.uid, selectedUser.id);
                await updateParticipantChat(selectedUser.id, auth.currentUser?.uid);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    };

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        messagesId, setMessagesId,
        messages, setMessages,
        selectedUser, setSelectedUser,
        sendMessage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;