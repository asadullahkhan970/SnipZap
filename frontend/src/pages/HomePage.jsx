import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useshowToast";
import { useEffect, useState } from "react";
import Post from "../component/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../component/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true);
      setPosts([]); // Clear existing posts before fetching

      try {
        const res = await fetch("/api/post/feed");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch posts");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setPosts(data); // Set posts data from API response

      } catch (error) {
        showToast("Error", error.message, "error"); // Show error toast message
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    getFeedPost(); // Fetch posts when the component is mounted
  }, [showToast, setPosts]);

  return (
    <Flex gap='10'>
      {/* Main content area with posts */}
      <Box
        flex={70}
        overflowY="auto"  // Enable vertical scrolling for posts
        height="calc(100vh - 100px)" // Adjust height to fit the viewport, subtracting for header and bottom bar
        mb="calc(env(safe-area-inset-bottom) + 70px)" // Add space for bottom navigation bar
        p={2}
      >
        {!loading && (!posts || posts.length === 0) && (
          <Text textAlign="center" fontSize="xl" color="gray.500">
            Follow some users to see the feed
          </Text>
        )}

        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {!loading &&
          posts &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>

      {/* Suggested users section (hidden on smaller screens) */}
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
