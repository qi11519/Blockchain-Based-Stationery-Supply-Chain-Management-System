import React, { useState, useEffect }  from "react";
import "./App.css";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate} from "react-router-dom";

const LoginPage = ({ setUser }) => { 
    let navigate = useNavigate(); 

    const [loading, setLoading] = useState(false);

    document.title = 'Suppy Chain Management System';

    useEffect(() => {
      setUser(null);
    }, [ setUser ]);

    const handleLogin = async () => {
      const Account_ID = document.getElementById('Account_ID').value;
      const Password = document.getElementById('Password').value;
    
        try {
          setLoading(true);
          const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Account_ID, Password })
          });
      
          if (response.ok) {
            // Login successful

            const user = await response.json();
            setUser({ user });
            
            setTimeout(() => {
              alert('Login successful!');
              let path;
              if (user.User_Type === 'deliverycompany'){
                path = `/view-delivery`;
              } else {
                path = `/view-order`;
              }
              navigate(path);
            }, 1000);
          } else {
            // Login failed
            alert('Invalid email or password');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to login');
        } finally {
          setTimeout(() => {
            setLoading(false); // Set loading back to false after the request is complete
          }, 1000);
        }
    };

    return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: '100%', backgroundColor: '#97c4d7', width: "100% !important", maxWidth: "100%"}}>
        <Row>
        <Col xs={12}>
            <Form>
            <h2 className="text-center mb-5" style={{ color: 'white' }}>Blockchain-Based<br/>Supply Chain<br/>Management Portal</h2>
            <FormGroup>
                <Label for="loginText" style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>LOGIN</Label>
                <Input type="userID" name="userID" id="Account_ID" placeholder="User ID" />
            </FormGroup>
            <FormGroup>
                <Input type="password" name="password" id="Password" placeholder="Password" />
            </FormGroup>
            
            </Form>
            <Button block style={{ backgroundColor: 'darkslateblue', color: 'white' }} onClick={handleLogin}>
              {loading ? (
              <div className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              'Login'
            )}
            </Button>
        </Col>
        </Row>
    </Container>
    );
};

export default LoginPage;
