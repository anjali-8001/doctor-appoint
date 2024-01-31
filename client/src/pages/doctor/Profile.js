import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col, Input, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timing, setTiming] = useState();

  const handleFinish = async (values) => {
    try {
      // console.log(values);
      dispatch(showLoading);
      const res = await axios.post(
        `${window.location.origin}/api/v1/doctor/updateProfile`,
        {
          ...values,
          userId: user._id,
          timings: [
            moment(timing[0].$d).format("HH:mm"),
            moment(timing[1].$d).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading);
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading);
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        `${window.location.origin}/api/v1/doctor/getDoctorInfo`,
        {
          userId: params.id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, []);

  return (
    <Layout>
      <h1 className="text-center p-3">Manage Profile</h1>
      {doctor && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...doctor,
            timings: [
              moment(doctor.timings[0], "HH:mm"),
              moment(doctor.timings[1], "HH:mm"),
            ],
          }}
        >
          <h4 className="">Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your First Name" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="Your Email Id" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your Last Name" />
              </Form.Item>
              <Form.Item label="Website" name="website">
                <Input type="text" placeholder="Your Website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No."
                name="phone"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your Phone No." />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your Address" />
              </Form.Item>
            </Col>
          </Row>
          <h4 className="">Professional Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your Specialization" />
              </Form.Item>
              <Form.Item label="Timings" name="timings" required>
                <TimePicker.RangePicker
                  format="HH:mm"
                  onChange={(value) => {
                    setTiming(value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Consulatation"
                name="feesPerConsultation"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Your fees per consultation" />
              </Form.Item>
            </Col>
          </Row>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary" type="submit">
              Update
            </button>
          </div>
        </Form>
      )}
    </Layout>
  );
}

export default Profile;
