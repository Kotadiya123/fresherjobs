// components/HtmlFileComponent.js

import React from 'react';

const HtmlFileComponent = () => {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe 
                src="/EasyEMI/index.html" 
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="My HTML File"
            ></iframe>
        </div>
    );
};

export default HtmlFileComponent;
