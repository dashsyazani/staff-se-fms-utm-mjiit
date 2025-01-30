import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import API from '../services/api';

const PublicGallery = () => {
  const [publicFiles, setPublicFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPublicFiles();
  }, []);

  const fetchPublicFiles = async () => {
    try {
      const { data } = await API.get('/files/public');
      setPublicFiles(data.files);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewFile = async (file) => {
    setSelectedFile(file);
    try {
      const { data } = await API.get(`/comments/${file._id}`);
      setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Login required to comment');
      return;
    }
    try {
      const { data } = await API.post('/comments', { fileId: selectedFile._id, content: newComment });
      alert(data.msg);
      setNewComment('');
      const { data: cData } = await API.get(`/comments/${selectedFile._id}`);
      setComments(cData.comments);
    } catch (err) {
      console.error(err);
      alert('Failed to post comment');
    }
  };

  const handleDownload = (filePath) => {
    window.open(`http://localhost:5000/${filePath}`, '_blank');
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <h4>Public Files</h4>
          {publicFiles.map(file => (
            <Card
              key={file._id}
              className="mb-3"
              style={{ backgroundColor: '#2d2d2d', color: '#fff', cursor: 'pointer' }}
              onClick={() => handleViewFile(file)}
            >
              <Card.Body>
                <Card.Title>{file.filename}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{file.fileType}</Card.Subtitle>
                <Card.Text>Uploaded: {new Date(file.createdAt).toLocaleString()}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={8}>
          {selectedFile ? (
            <div style={{ backgroundColor: '#2d2d2d', padding: '1rem', borderRadius: '5px' }}>
              <h5>{selectedFile.filename}</h5>
              <p>Section: {selectedFile.section}</p>
              <p>Uploaded: {new Date(selectedFile.createdAt).toLocaleString()}</p>
              <p>Last Edited: {selectedFile.lastEdited
                ? new Date(selectedFile.lastEdited).toLocaleString()
                : 'N/A'}
              </p>
              <Button variant="outline-light" onClick={() => handleDownload(selectedFile.filePath)}>
                Download
              </Button>
              <hr />
              <h6>Comments</h6>
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                {comments.map(c => (
                  <div key={c._id} style={{ marginBottom: '10px' }}>
                    <strong>{c.userId?.displayName || 'User'}:</strong> {c.content}
                    <br />
                    <small style={{ color: '#ccc' }}>
                      {new Date(c.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleAddComment}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  Add Comment
                </Button>
              </Form>
            </div>
          ) : (
            <p>Select a file to view details...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PublicGallery;
