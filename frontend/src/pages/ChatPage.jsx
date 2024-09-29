import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    IconButton,
    Input,
    Skeleton,
    SkeletonCircle,
    Text,
    useColorModeValue,
    useBreakpointValue,
} from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi"; // Import conversation icon
import { MdArrowBack } from "react-icons/md"; // Import back icon
import Conversation from "../component/Conversation";
import MessageContainer from "../component/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useshowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
    const [searchingUser, setSearchingUser] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const { socket, onlineUsers } = useSocket();

    const isMobile = useBreakpointValue({ base: true, md: false }); 

    useEffect(() => {
        socket?.on("messagesSeen", ({ conversationId }) => {
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
        });
    }, [socket, setConversations]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setConversations(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingConversations(false);
            }
        };

        getConversations();
    }, [showToast, setConversations]);

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        try {
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();
            if (searchedUser.error) {
                showToast("Error", searchedUser.error, "error");
                return;
            }

            const messagingYourself = searchedUser._id === currentUser._id;
            if (messagingYourself) {
                showToast("Error", "You cannot message yourself", "error");
                return;
            }

            const conversationAlreadyExists = conversations.find(
                (conversation) => conversation.participants[0]._id === searchedUser._id
            );

            if (conversationAlreadyExists) {
                setSelectedConversation({
                    _id: conversationAlreadyExists._id,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePic,
                });
                return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: "",
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic,
                    },
                ],
            };
            setConversations((prevConvs) => [...prevConvs, mockConversation]);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSearchingUser(false);
        }
    };
    useEffect(() => {
        socket?.on("newMessage", (message) => {
            // Update the conversations to reflect the new message
            setConversations((prevConversations) => {
                return prevConversations.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: message,
                        };
                    }
                    return conversation;
                });
            });

            // If the message is part of the selected conversation, update the messages in MessageContainer
            if (selectedConversation._id === message.conversationId) {
                setSelectedConversation((prevSelected) => ({
                    ...prevSelected,
                    messages: [...(prevSelected.messages || []), message], 
                }));
            }
        });

        return () => {
            socket?.off("newMessage");
        };
    }, [socket, setConversations, selectedConversation._id, setSelectedConversation]);


    return (
        <Box
            position={"absolute"}
            left={"50%"}
            w={{ base: "100%", md: "80%", lg: "750px" }}
            p={4}
            transform={"translateX(-50%)"}
        >
            <Flex
                gap={4}
                flexDirection={{ base: "column", md: "row" }}
                maxW={{
                    sm: "400px",
                    md: "full",
                }}
                mx={"auto"}
            >
                {/* Conversations List */}
                {(!selectedConversation._id || !isMobile) && (
                    <Flex
                        flexDirection={"column"}
                        maxW={{ sm: "250px", md: "30%" }}
                        flex={30}
                        borderRadius={"md"}
                        p={0}
                        mt={{ base: 0, md: 6 }}
                        w={{ base: "100%", md: "full" }}
                        height={{ base: "calc(100vh - 100px)", md: "400px" }}
                        alignItems={"flex-start"}
                        justifyContent={"flex-start"}
                    >
                        <Text
                            fontWeight={700}
                            fontSize="2xl"
                            color={useColorModeValue("gray.600", "gray.400")}
                            borderRadius="md"
                            boxShadow="md"
                            marginBottom={2}
                        >
                            SnipZap
                        </Text>

                        <form onSubmit={handleConversationSearch}>
                            <Flex alignItems={"center"} gap={2} w={"100%"}>
                                <Input
                                    placeholder='Search for a user'
                                    onChange={(e) => setSearchText(e.target.value)}
                                    w={"100%"}
                                />
                                <Button size={"sm"} type="submit" isLoading={searchingUser}>
                                    <SearchIcon />
                                </Button>
                            </Flex>
                        </form>

                        {loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

                        {!loadingConversations &&
                            conversations.map((conversation) => {
                                const firstParticipant = conversation.participants?.[0];

                                return firstParticipant ? (
                                    <Flex
                                        key={conversation._id}
                                        w="100%"
                                        borderRadius="md"
                                        p={2}
                                    >
                                        <Conversation
                                            isOnline={onlineUsers.includes(firstParticipant._id)}
                                            conversation={conversation}
                                            onClick={() => setSelectedConversation(conversation)}
                                        />
                                    </Flex>
                                ) : null;
                            })}

                    </Flex>
                )}

                {/* Message Container (visible on selecting conversation) */}
                <Flex
                    flex={70}
                    borderRadius={"md"}
                    p={0}
                    mt={{ base: 0, md: 6 }}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w={{ base: "100%", md: "70%" }}
                    height={{ base: "calc(100vh - 100px)", md: "500px" }}
                >
                    {/* Back Button for Mobile */}
                    {isMobile && selectedConversation._id && (
                        <Flex display={"flex"} ml={"2px"} width={"full"}>
                            <IconButton
                                icon={<MdArrowBack />}
                                aria-label="Back to conversations"
                                mb={4}
                                onClick={() => setSelectedConversation({})}
                            />
                        </Flex>
                    )}

                    {/* Show GiConversation Icon and text when no conversation is selected */}
                    {!selectedConversation._id && !isMobile && (
                        <Flex
                            flexDir={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            height={"100%"}
                            color={useColorModeValue("gray.600", "gray.400")}
                        >
                            <GiConversation size={100} />
                            <Text mt={4} fontSize={"xl"}>
                                Select a conversation to start messaging
                            </Text>
                        </Flex>
                    )}

                    {/* Message Container when conversation is selected */}
                    {selectedConversation._id && (
                        <Flex
                            width={"100%"}
                            height={"100%"}
                            maxWidth={{ base: "100%", md: "800px", lg: "1000px" }}
                            marginX={{ base: "0", md: "auto" }}
                            borderRadius="md"
                            borderWidth={1}
                            borderColor={useColorModeValue("gray.200", "gray.700")}
                            boxShadow={"lg"}
                        >
                            <MessageContainer conversationId={selectedConversation._id} />
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default ChatPage;
