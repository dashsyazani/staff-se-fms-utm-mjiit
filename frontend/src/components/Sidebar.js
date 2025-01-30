import React from 'react';
import { ListGroup } from 'react-bootstrap';

const sections = [
  'Appointment Letter, Timetable & Attendance',
  'CARS & CASR, EOC Survey',
  'Indirect Assessment',
  'Memo/Minutes Meeting on T & L',
  'Course Information',
  'Lecture Notes',
  'Formative Assessment',
  'Summative Assessment',
  'Students Marks'
];

const Sidebar = ({ onSelectSection, selectedSection }) => {
  return (
    <ListGroup>
      {sections.map((sec, idx) => (
        <ListGroup.Item
          key={idx}
          active={selectedSection === sec}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectSection(sec)}
        >
          {sec}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Sidebar;
