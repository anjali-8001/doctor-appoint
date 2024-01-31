import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LayoutStyles.css";
import Layout from "../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";

function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const getUserData = async () => {
    try {
      const res = await axios.get(
        `${window.location.origin}/api/v1/user/getAllDoctors`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <Layout>
        <h1 className="text-center p-3">Homepage</h1>
        <h4 className="m-4">All Doctors</h4>
        <Row>
          {doctors &&
            doctors.map((doctor, index) => (
              <DoctorList key={index} doctor={doctor} />
            ))}
        </Row>
      </Layout>
    </div>
  );
}

export default HomePage;
