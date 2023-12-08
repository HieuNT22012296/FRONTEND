import styled from "styled-components";
import { Col } from "react-bootstrap"

export const CustomCol = styled(Col)`
  font-size: 12px;
  border: 1px solid #ddd;
  padding: 5px;
  margin: 10px;
  cursor: pointer;
  border-radius: 40px;
  background-color: #f8f9fa;
  transition: all 0.3s ease; /* Thêm hiệu ứng chuyển động cho smooth hover */
  
  &:hover {
    background-color: var(--primary-color);
    color: #FF6A6A;
    border-radius: 40px;
    font-weight: bold;
    transform: scale(1.1); /* Hiệu ứng scale */
  }
`
