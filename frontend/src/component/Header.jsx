import {
  Flex,
  Link,
  useColorMode,
  IconButton,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faBars } from "@fortawesome/free-solid-svg-icons";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import userAtom from "../atoms/userAtom";
import authScreenAtom from "../atoms/authAtom";
import { useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUsers from "../component/SuggestedUsers";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom); // Get the user value from Recoil
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom); // Manage auth state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showNavBar, setShowNavBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Handle navbar visibility on scroll
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Check if the current route is an auth page
  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <>
      {!isMobile && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p={4}
          mb={8}
          pb={4}
          gap={6}
          mt={6}
        >
          {user && (
            <>
              {/* Home icon in top-left */}
              <Link as={RouterLink} to={"/"}>
                <AiFillHome size={30} />
              </Link>

              <IconButton
                aria-label="Toggle theme"
                icon={<FontAwesomeIcon icon={faComments} size="2x" />}
                onClick={toggleColorMode}
                variant="ghost"
                size="lg"
                _hover={{ bg: "transparent" }}
                color={colorMode === "light" ? "black" : "white"}
              />

              <Flex alignItems="center" gap={4} marginRight="10px">
                <Link as={RouterLink} to={`/chat`}>
                  <BsFillChatQuoteFill size={20} />
                </Link>
                <Link as={RouterLink} to={`/settings`}>
                  <MdOutlineSettings size={24} />
                </Link>

                <Link as={RouterLink} to={`/${user.username}`}>
                  <RxAvatar size={24} />
                </Link>
                <Button
                  size={"sm"}
                  onClick={() => {
                    logout(); // Perform the logout action
                    onClose(); // Close the drawer after logout
                  }}
                >
                  <FiLogOut size={20} />
                </Button>
              </Flex>
            </>
          )}

          {!user && (
            <>
              {/* Login button on the left */}
              <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
                Login
              </Link>

              <IconButton
                aria-label="App logo"
                icon={<FontAwesomeIcon icon={faComments} size="2x" />}
                onClick={toggleColorMode}
                variant="ghost"
                size="lg"
                _hover={{ bg: "transparent" }}
                color={colorMode === "light" ? "black" : "white"}
              />

              <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
                Sign up
              </Link>
            </>
          )}
        </Flex>
      )}

      {isMobile && !isAuthPage && (
        <>
          {/* Mobile header */}
          <Box
            left={0}
            right={0}
            p={3}
            boxShadow="sm"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Box position="absolute" top={4} left={4}>
              <IconButton
                aria-label="Open navigation"
                icon={<FontAwesomeIcon icon={faBars} />}
                color={colorMode === "light" ? "black" : "white"}
                bg="transparent"
                _hover={{ bg: "transparent" }}
                onClick={onOpen}
                size="lg"
              />
            </Box>

            <IconButton
              aria-label="App logo"
              icon={<FontAwesomeIcon icon={faComments} size="2x" />}
              variant="ghost"
              size="lg"
              _hover={{ bg: "transparent" }}
              color={colorMode === "light" ? "black" : "white"}
              onClick={toggleColorMode}
            />
          </Box>

          {/* Drawer only when not on auth pages */}
          {user && ( // Ensure the drawer only shows for authenticated users
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>SnipZap</DrawerHeader>
                <DrawerBody>
                  <Flex direction="column" gap={4}>
                    <Link as={RouterLink} to={`/settings`} onClick={onClose}>
                      <MdOutlineSettings size={24} /> Settings
                    </Link>
                    <Button
                      size={"sm"}
                      onClick={() => {
                        logout(); // Perform logout
                        onClose(); // Close drawer after logout
                      }}
                      leftIcon={<FiLogOut size={20} />}
                    >
                      Logout
                    </Button>
                    <SuggestedUsers />
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          )}

          {user && (
            <Box
              position="fixed"
              bottom={0}
              left={0}
              right={0}
              bg={colorMode === "light" ? "white" : "gray.800"}
              p={3}
              boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
              zIndex={10}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingBottom="calc(env(safe-area-inset-bottom) + 20px)"
              transition="transform 0.3s ease-in-out"
              transform={showNavBar ? "translateY(0)" : "translateY(100%)"}
            >
              <Link as={RouterLink} to={"/"}>
                <AiFillHome size={30} />
              </Link>

              <Link as={RouterLink} to={`/chat`}>
                <BsFillChatQuoteFill size={30} />
              </Link>

              <Link as={RouterLink} to={`/${user.username}`}>
                <RxAvatar size={30} />
              </Link>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default Header;
