import { useEffect, useState } from "react";
import UserHeader from "../component/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useshowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../component/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/post/user/${username}`);
				const data = await res.json();
				setPosts(data); // Set fetched posts in Recoil state
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

	// Function to add a new post to the posts atom
	const addPost = (newPost) => {
		setPosts((prevPosts) => [...prevPosts, newPost]); // Append new post to existing posts
	};

	// Render loading spinner while fetching user profile
	if (loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	// Render user not found message
	if (!user) {
		return <h1>User not found</h1>;
	}

	return (
		<>
	
			<UserHeader user={user} />

			{!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12} >
					<Spinner size={"xl"} />
				</Flex>
			)}

			{Array.isArray(posts) && posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy}  />
			))}
			

		</>
	);
};

export default UserPage;
