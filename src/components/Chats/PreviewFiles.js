import React from "react";
import './Chats.css';

const PreviewFiles = ({ files }) => {
    return (
        <div className="preview-files-container">
            {files.map((file, index) => {
                const fileType = file.type;

                if (fileType.startsWith("image/")) {
                    return (
                        <div key={index} className="preview-item">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="preview-thumbnail"
                            />
                            <span className="preview-name">{file.name}</span>
                        </div>
                    );
                } else if (fileType.startsWith("audio/")) {
                    return (
                        <div key={index} className="preview-item">
                            <span className="preview-icon">🎵</span>
                            <span className="preview-name">{file.name}</span>
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className="preview-item">
                            <span className="preview-icon">📄</span>
                            <span className="preview-name">{file.name}</span>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default PreviewFiles;
