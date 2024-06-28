import React from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowUp } from 'react-icons/fa'; // Import arrow-up icon

const GoToTopButton: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
                            {/* @ts-ignore */}

    <Button
      variant="primary"
      className="go-to-top-btn"
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <FaArrowUp style={{ fontSize: '24px' }} /> 
      <span style={{ marginTop: '5px' }}>Go to Top</span> {/* Text below button */}
    </Button>
    </>
  );
};

export default GoToTopButton;