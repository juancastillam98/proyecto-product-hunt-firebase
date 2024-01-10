import styled from "styled-components";
export const Boton = styled.a`
  display: block;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #d1d1d1;
  padding: .8rem 2rem;
  margin: 2rem auto; 
  text-align: center;
  //le podemos pasar props al componente
  background-color: ${props => props.backgroundColor ? "#DA552F" : "white"};
  color: ${props => props.backgroundColor ? "white" : "black"};
  &:last-of-type{
    margin-right: 0;
  }
  &:hover{
    cursor: pointer;
  }
`
