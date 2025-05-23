import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress, // <-- Add this import
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const FileUpload: React.FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  // Transcribed data state
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [loadingTranscripts, setLoadingTranscripts] = useState(false);

  // Fetch transcripts on mount
  useEffect(() => {
    const fetchTranscripts = async () => {
      setLoadingTranscripts(true);
      try {
        const res = await axios.get('http://localhost:4000/api/transcripts');
        setTranscripts(res.data);
      } catch (err) {
        setTranscripts([]);
      }
      setLoadingTranscripts(false);
    };
    fetchTranscripts();
  }, []);

  // Transcript-only upload
  const handleTranscriptOnly = async () => {
    if (!file) return;
    setTranscriptLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:4000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Add new transcript to the top of the transcripts list
      setTranscripts([
        {
          transcript: res.data.transcript || 'No transcript returned.',
          createdAt: new Date().toISOString(),
        },
        ...transcripts,
      ]);
    } catch (err) {
      setTranscripts([
        {
          transcript: 'Transcription failed.',
          createdAt: new Date().toISOString(),
        },
        ...transcripts,
      ]);
    }
    setTranscriptLoading(false);
    setFile(null); // <-- Clear the uploaded file after transcription
    if (fileInput.current) {
      fileInput.current.value = ''; // <-- Reset the file input value
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 900, px: 2 }}>
        <Paper
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 4,
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
             Video/Audio Upload & Transcription
          </Typography>
          <input
            ref={fileInput}
            type="file"
            accept="video/mp4,audio/mp3,audio/wav,audio/mpeg,audio/x-wav,audio/webm,audio/ogg"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => fileInput.current?.click()}
            sx={{
              mr: 2,
              borderRadius: 3,
              boxShadow: 2,
              fontWeight: 600,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Select File
          </Button>
          {file && (
            <Typography variant="body1" sx={{ display: 'inline', mr: 2 }}>
              {file.name}
            </Typography>
          )}
          {/* Transcript Only Button */}
          <Button
            variant="outlined"
            color="primary"
            disabled={!file || transcriptLoading}
            onClick={handleTranscriptOnly}
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              fontWeight: 600,
              ml: 2,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'primary.light' },
            }}
          >
            {transcriptLoading ? 'Transcribing...' : 'Upload and Transcribe'}
          </Button>
          {/* Progress Bar */}
          {transcriptLoading && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
        </Paper>

        {/* Transcribed Data Section */}
        <Paper
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            mt: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
            Transcribed Data
          </Typography>
          {loadingTranscripts ? (
            <Typography>Loading transcripts...</Typography>
          ) : transcripts.length === 0 ? (
            <Typography>No transcripts found.</Typography>
          ) : (
            transcripts.map((t, idx) => (
              <Box key={t._id || idx} sx={{ mb: 3, p: 2, background: '#f9f9f9', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {t.transcript || 'No transcript available.'}
                </Typography>
              </Box>
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default FileUpload;