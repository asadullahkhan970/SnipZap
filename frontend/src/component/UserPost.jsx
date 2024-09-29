import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Action from "./Action";

const UserPost = ({ postImg, postTitle, likes, replies }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex
        direction={{ base: "column", md: "row" }} // Column on small screens, row on medium and larger screens
        gap={3}
        mb={4}
        py={5}
        px={{ base: 2, md: 4 }} // Responsive padding
      >
        <Flex
          flexDirection={"column"}
          alignItems={"center"}
          display={{ base: "none", md: "flex" }} // Hide avatars on small screens
        >
          <Avatar size='md' name="Zuckerberg" src="/zuck-avatar.png" />
          <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size="xs"
              name="John Snow"
              src="https://bit.ly/dan-abramov"
              position={"absolute"}
              top={"0px"}
              left="15px"
              padding={"2px"}
            />
            <Avatar
              size="xs"
              name="Tyrion"
              src="https://bit.ly/code-beast"
              position={"absolute"}
              bottom={"0px"}
              right="-5px"
              padding={"2px"}
            />
            <Avatar
              size="xs"
              name="Lannister"
              src="https://bit.ly/prosper-baba"
              position={"absolute"}
              bottom={"0px"}
              left="4px"
              padding={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex
            justifyContent={"space-between"}
            w={"full"}
            flexDirection={{ base: "column", sm: "row" }} // Stack items vertically on small screens
          >
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                markzuckerberg
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex
              gap={4}
              alignItems={"center"}
              mt={{ base: 2, sm: 0 }} // Margin top on small screens
            >
              <Text fontSize={"xs"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{postTitle}</Text>
          {postImg && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
              mt={2}
            >
              <Image src={postImg} w={"full"} />
            </Box>
          )}
          <Flex
            gap={3}
            my={1}
            flexDirection={{ base: "column", sm: "row" }} // Stack actions vertically on small screens
          >
            <Action liked={liked} setLiked={setLiked} />
          </Flex>
          <Flex
            gap={2}
            alignItems={"center"}
            flexDirection={{ base: "column", sm: "row" }} // Stack replies and likes vertically on small screens
            mt={2}
          >
            <Text color={"gray.light"} fontSize={'sm'}>
              {replies} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize='sm'>
              {likes} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
