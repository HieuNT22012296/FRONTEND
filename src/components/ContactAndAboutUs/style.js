// style.js
import styled from 'styled-components';


export const WrapperContactAndAboutUs = styled.div`
  background-color: #186c91;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  padding: 10px 10px;
  font-size: 15px;
  color: #fff;
 
`;

export const ContactInfo = styled.div`
  flex-basis: 100%; // Chiếm toàn bộ chiều rộng trên điện thoại
  margin-bottom: 20px;

  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

export const AboutUsInfo = styled.div`
  
  flex-basis: 100%; // Chiếm toàn bộ chiều rộng trên điện thoại
  margin-bottom: 20px;
`;
