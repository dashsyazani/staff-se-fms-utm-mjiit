import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import API from '../services/api';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/resetPassword', { token, newPassword });
      alert(data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>Reset Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Reset Token</Form.Label>
              <Form.Control
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Reset Password</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
