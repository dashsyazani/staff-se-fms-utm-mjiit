import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import API from '../services/api';

const Profile = () => {
  const [user, setUser] = useState({});
  const [displayName, setDisplayName] = useState('');
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setDisplayName(parsed.displayName || '');
      setFullName(parsed.fullName || '');
    }
  }, []);

  const handleProfileUpload = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      alert('No profile picture selected');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('profilePicture', profileImage);
      const { data } = await API.post('/users/uploadProfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(data.msg);
      const updatedUser = { ...user, profilePicture: data.profilePicture };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      alert('Profile upload failed');
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/users/editProfile', { displayName, fullName });
      alert(data.msg);
      const updatedUser = { ...user, displayName, fullName };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/users/changePassword', { oldPassword, newPassword });
      alert(data.msg);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Password change failed');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#2d2d2d', color: '#fff' }}>
            <Card.Body>
              <Card.Title>Your Profile Picture</Card.Title>
              {user.profilePicture ? (
                <img
                  src={`http://localhost:5000/${user.profilePicture}`}
                  alt="Profile"
                  className="img-fluid mb-3"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              ) : (
                <p>No profile picture uploaded</p>
              )}
              <Form onSubmit={handleProfileUpload}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload New Picture</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update Picture
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card style={{ backgroundColor: '#2d2d2d', color: '#fff' }} className="mb-3">
            <Card.Body>
              <Card.Title>Edit Profile</Card.Title>
              <Form onSubmit={handleEditProfile}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card style={{ backgroundColor: '#2d2d2d', color: '#fff' }}>
            <Card.Body>
              <Card.Title>Change Password</Card.Title>
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
