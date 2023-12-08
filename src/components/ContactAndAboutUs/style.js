// style.js
import styled from 'styled-components';

const media = {
  xs: (styles) => `
    @media only screen and (max-width: 576px) {
      ${styles}
    }
  `,
  sm: (styles) => `
    @media only screen and (min-width: 577px) and (max-width: 768px) {
      ${styles}
    }
  `,
  md: (styles) => `
    @media only screen and (min-width: 769px) and (max-width: 992px) {
      ${styles}
    }
  `,
  lg: (styles) => `
    @media only screen and (min-width: 993px) and (max-width: 1200px) {
      ${styles}
    }
  `,
  xl: (styles) => `
    @media only screen and (min-width: 1201px) {
      ${styles}
    }
  `,
};

export const WrapperContactAndAboutUs = styled.div`
  background-color: #186c91;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  padding: 10px 10px;
  font-size: 10px;
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
