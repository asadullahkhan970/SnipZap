import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Image,
	Stack,
	Text,
	WrapItem,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
	const user = conversation.participants[0];
	const currentUser = useRecoilValue(userAtom);
	const lastMessage = conversation.lastMessage || {}; // Fallback to an empty object if undefined
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const { colorMode } = useColorMode();

	console.log(`User: ${user.username}, Is Online: ${isOnline}`); 
	console.log("Last Message:", lastMessage); // Debugging log

	return (
		<Flex
			gap={4}
			alignItems={"center"}
			p={"2"}
			borderRadius={"md"}
			transition={"background-color 0.2s, transform 0.2s"}
			onClick={() =>
				setSelectedConversation({
					_id: conversation._id,
					userId: user._id,
					userProfilePic: user.profilePic,
					username: user.username,
					mock: conversation.mock,
				})
			}
			// Background for selected conversation
			bg={
				selectedConversation?._id === conversation._id
					? useColorModeValue("gray.300", "gray.600")
					: ""
			}
			// Hover effect
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("gray.100", "gray.700"),
				transform: "scale(1.02)",
				boxShadow: "md",
			}}
		>
			<WrapItem>
				<Avatar
					size={{
						base: "xs",
						sm: "sm",
						md: "md",
					}}
					src={user.profilePic}
				>
					{isOnline && <AvatarBadge boxSize="1em" bg="green.500" />}
				</Avatar>
			</WrapItem>

			<Stack direction={"column"} fontSize={"sm"}>
				<Text fontWeight="700" display={"flex"} alignItems={"center"}>
					{user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
				</Text>
				<Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
					{currentUser._id === lastMessage.sender ? (
						<Box color={lastMessage.seen ? "blue.400" : ""}>
							<BsCheck2All size={16} />
						</Box>
					) : null}
					{lastMessage.text && lastMessage.text.length > 18
						? lastMessage.text.substring(0, 18) + "..."
						: lastMessage.text || <BsFillImageFill size={16} />}
				</Text>
			</Stack>
		</Flex>
	);
};

export default Conversation;
