// ContactAndAboutUs.js
import React from 'react';
import { WrapperContactAndAboutUs, ContactInfo, AboutUsInfo } from './style';
import { Col, Row } from 'react-bootstrap';

const ContactAndAboutUs = () => (
  <WrapperContactAndAboutUs>
    {/* Cột cho Instructors */}
    <Col xs={12} md={4} lg={2}>
      <ContactInfo>
        <h2>Instructors</h2>
        <div>
          <p>Đặng Thanh Linh Phú</p>
          <p>Lecturers: Hoa Sen University</p>
          <p>Email: phu.dtl@hoasen.edu.vn</p>
          <p>Phone: +123 456 7890</p>     
        </div>
      </ContactInfo>
    </Col>

    {/* Cột cho Contact */}
    <Col xs={12} md={8} lg={4}>
      <ContactInfo>
        <h2>Contact</h2>
        <div>
          <p>Nguyễn Tiến Đạt</p>
          <p>Email: dat.nt3160@gmail.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Mssv: 2183160</p>
        </div>
        <div>
          <p>Nguyễn Trung Hiếu</p>
          <p>Email: hieu.nt12296@sinhvien.hoasen.edu.vn</p>
          <p>Phone: +123 456 7890</p>
          <p>Mssv: 22012296</p>
        </div>
      </ContactInfo>
    </Col>

    {/* Cột cho About Us */}
    <Col xs={12} md={12} lg={6}>
      <AboutUsInfo>
        <h2>About Us</h2>
        <div>
          <p>Ngày bắt đầu Dự án Website: 11/09/2023</p>
          <p>Phương châm "Công Nghệ Tạo Nên Sự Khác Biệt"</p>
        </div>
      </AboutUsInfo>
    </Col>
  </WrapperContactAndAboutUs>
);

export default ContactAndAboutUs;
