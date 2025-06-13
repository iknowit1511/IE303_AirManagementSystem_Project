import React from "react";
import Navbar from "../components/navbar/Navbar";
import Signin from "../components/auth/Signin";
import Footer from "../components/footer/Footer";

const SigninPage = () => {
  return (
    <>
      <Navbar />
      <Signin />
      <Footer />
    </>
  );
};

export default SigninPage;