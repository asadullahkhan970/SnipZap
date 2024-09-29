import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Avatar, Center } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useshowToast";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();

	// Handle form submission for updating the profile
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return; // Prevent multiple submissions
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated successfully", "success");
			setUser((prevUser) => ({
				...prevUser,
				...data,
				_id: prevUser._id || data._id, // Keep _id consistent
			}));
			localStorage.setItem("user-threads", JSON.stringify({ ...user, ...data }));
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setUpdating(false);
		}
	};

	const handleCancel = () => {
		setInputs({
			name: user.name,
			username: user.username,
			email: user.email,
			bio: user.bio,
			password: "",
		});
	};

	return (
		<Box
			flex={70}
			overflowY="auto" // Enable vertical scrolling for the container
			height="calc(100vh - 100px)" // Set height relative to the viewport, accounting for header/footer
			mb="calc(env(safe-area-inset-bottom) + 70px)" // Add space for bottom navigation bar
			p={2}
		>
			<form onSubmit={handleSubmit}>
				<Flex justify="center">
					<Stack
						spacing={4}
						w={"full"}
						maxW={"md"}
						bg={useColorModeValue("white", "gray.dark")}
						rounded={"xl"}
						boxShadow={"lg"}
						p={6}
					>
						<Heading
							lineHeight={1.1}
							fontSize={{ base: "2xl", sm: "3xl" }}
							textAlign={{ base: "center", sm: "left" }} // Center on small screens, left-align on larger
						>
							User Profile Edit
						</Heading>

						<FormControl id="userName">
							<Stack direction={["column", "row"]} spacing={6}>
								<Center>
									<Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
								</Center>
								<Center w="full">
									<Button w="full" onClick={() => fileRef.current.click()}>
										Change Avatar
									</Button>
									<Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
								</Center>
							</Stack>
						</FormControl>
						<FormControl>
							<FormLabel>Full name</FormLabel>
							<Input
								placeholder="John Doe"
								value={inputs.name}
								onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
								_placeholder={{ color: "gray.500" }}
								type="text"
							/>
						</FormControl>
						<FormControl>
							<FormLabel>User name</FormLabel>
							<Input
								placeholder="johndoe"
								value={inputs.username}
								onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
								_placeholder={{ color: "gray.500" }}
								type="text"
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Email address</FormLabel>
							<Input
								placeholder="your-email@example.com"
								value={inputs.email}
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
								_placeholder={{ color: "gray.500" }}
								type="email"
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Bio</FormLabel>
							<Input
								placeholder="Your bio."
								value={inputs.bio}
								onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
								_placeholder={{ color: "gray.500" }}
								type="text"
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input
								placeholder="password"
								value={inputs.password}
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
								_placeholder={{ color: "gray.500" }}
								type="password"
							/>
						</FormControl>
						<Stack spacing={6} direction={["column", "row"]}>
							<Button
								bg={"red.400"}
								color={"white"}
								w="full"
								_hover={{
									bg: "red.500",
								}}
								onClick={handleCancel} 
							>
								Cancel
							</Button>
							<Button
								bg={"green.400"}
								color={"white"}
								w="full"
								_hover={{
									bg: "green.500",
								}}
								type="submit"
								isLoading={updating}
							>
								Submit
							</Button>
						</Stack>
					</Stack>
				</Flex>
			</form>
		</Box>
	);
}
