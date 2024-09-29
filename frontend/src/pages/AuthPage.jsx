// import SignupCard from "../component/SignupCard";

import { useRecoilValue } from "recoil";
import LoginCard from "../component/LoginCard";
import authScreenAtom from "../atoms/authAtom";
import SignupCard from "../component/SignupCard";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  return (
    <>
    {authScreenState ==="login" ? <LoginCard/>:<SignupCard/>}
      
    </>
  );
};

export default AuthPage;
