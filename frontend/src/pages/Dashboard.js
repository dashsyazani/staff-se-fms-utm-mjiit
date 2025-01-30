import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('');
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    lecturerName: '',
    courseNameCode: '',
    sessionSemester: '',
    courseOwner: ''
  });
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(prev => ({ ...prev, lecturerName: parsedUser.fullName || '' }));
    }
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await API.get('/files');
      setFiles(data.files);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedSection) {
      alert('Please select a section.');
      return;
    }
    if (!file) {
      alert('Please choose a file.');
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('section', selectedSection);
    dataToSend.append('lecturerName', formData.lecturerName);
    dataToSend.append('courseNameCode', formData.courseNameCode);
    dataToSend.append('sessionSemester', formData.sessionSemester);
    dataToSend.append('courseOwner', formData.courseOwner);
    dataToSend.append('isPublic', isPublic);
    dataToSend.append('file', file);

    try {
      await API.post('/files/upload', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File uploaded successfully!');
      setFile(null);
      setIsPublic(false);
      setFormData(prev => ({
        ...prev,
        courseNameCode: '',
        sessionSemester: '',
        courseOwner: ''
      }));
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert('File upload failed');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await API.delete(`/files/${fileId}`);
      alert('File deleted');
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col xs={12} md={3} lg={2}>
          <Sidebar onSelectSection={handleSectionSelect} selectedSection={selectedSection} />
        </Col>
        <Col xs={12} md={9} lg={10}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3>Welcome, {user?.fullName || 'Lecturer'}!</h3>
            {user.profilePicture && (
              <img
                src={`http://localhost:5000/${user.profilePicture}`}
                alt="Profile"
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginLeft: '10px'
                }}
              />
            )}
          </div>
          <p><strong>Selected Section:</strong> {selectedSection || 'None'}</p>

          <Form onSubmit={handleUpload}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Lecturer Name (Auto):</Form.Label>
                <Form.Control
                  type="text"
                  name="lecturerName"
                  value={formData.lecturerName}
                  readOnly
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Course Name/Code:</Form.Label>
                <Form.Select
                  name="courseNameCode"
                  value={formData.courseNameCode}
                  onChange={handleChange}
                >
                  <option value="">-- Select --</option>
                  <option value="SE101">SE101</option>
                  <option value="SE102">SE102</option>
                </Form.Select>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Session/Semester:</Form.Label>
                <Form.Control
                  type="text"
                  name="sessionSemester"
                  placeholder="e.g. 2025, Semester 1"
                  value={formData.sessionSemester}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Course Owner (Dept):</Form.Label>
                <Form.Control
                  type="text"
                  name="courseOwner"
                  placeholder="e.g. MJIIT"
                  value={formData.courseOwner}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>File:</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Col>
              <Col md={6} className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Check
                  type="checkbox"
                  label="Make Public?"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Upload
            </Button>
          </Form>

          <hr />
          <h5>Uploaded Files</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Section</th>
                <th>File Type</th>
                <th>Public</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(f => (
                <tr key={f._id}>
                  <td>{f.filename}</td>
                  <td>{f.section}</td>
                  <td>{f.fileType}</td>
                  <td>{f.isPublic ? 'Yes' : 'No'}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(f._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No files uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
