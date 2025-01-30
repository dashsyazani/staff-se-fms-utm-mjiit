import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import API from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/forgotPassword', { email });
      alert(data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>Forgot Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Send Reset Token</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
