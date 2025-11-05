import React, { useEffect } from 'react';
import { Event, User } from '../types';

interface CertificateCanvasProps {
    event: Event;
    user: User;
    onDone: () => void;
}

const CertificateCanvas: React.FC<CertificateCanvasProps> = ({ event, user, onDone }) => {
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            alert('Failed to get canvas context.');
            onDone();
            return;
        }

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Inner border
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

        // Title
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE OF PARTICIPATION', canvas.width / 2, 150);

        // Subtitle
        ctx.font = '30px Arial';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText('This is to certify that', canvas.width / 2, 230);

        // Student name
        ctx.font = 'bold 50px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(user.name, canvas.width / 2, 320);

        // Description
        ctx.font = '30px Arial';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText('has successfully participated in', canvas.width / 2, 390);

        // Event name
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = '#3498db';
        ctx.fillText(event.title, canvas.width / 2, 460);

        // Organizer
        ctx.font = '25px Arial';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText(`Organized by ${event.organizer}`, canvas.width / 2, 520);
        
        // Date
        const eventDate = new Date(event.date);
        ctx.fillText(`on ${eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, canvas.width / 2, 570);

        // Signature line
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(400, 680);
        ctx.lineTo(800, 680);
        ctx.stroke();
        ctx.font = '20px Arial';
        ctx.fillStyle = '#2c3e50';
        ctx.fillText('Authorized Signature', canvas.width / 2, 710);

        // Download
        canvas.toBlob(function(blob) {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificate-${event.title.replace(/\s+/g, '-')}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            onDone();
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event, user]);

    return null; // This component does not render anything
};

export default CertificateCanvas;
