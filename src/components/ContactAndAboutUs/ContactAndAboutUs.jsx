// ContactAndAboutUs.js
import React from 'react';
import { WrapperContactAndAboutUs, ContactInfo, AboutUsInfo } from './style';

const ContactAndAboutUs = () => (
  <WrapperContactAndAboutUs>
    <ContactInfo>
      <h2>Instructors</h2>
      <div>
        <p>Đặng Thanh Linh Phú</p>
        <p>Lecturers: Hoa Sen University</p>
        <p>Email: phu.dtl@hoasen.edu.vn</p>
        <p>Phone: +123 456 7890</p>     
      </div>
    </ContactInfo>
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
    <AboutUsInfo>
      <h2>About Us</h2>
      <div>
        <p>Ngày bắt đầu Dự án Website: 11/09/2023</p>
        <p>Phương châm "Công Nghệ Tạo Nên Sự Khác Biệt"</p>
      </div>
    </AboutUsInfo>
  </WrapperContactAndAboutUs>
);

export default ContactAndAboutUs;
