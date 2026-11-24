import os
import asyncio
import logging
from app.config import settings

logger = logging.getLogger(__name__)

async def transcribe_audio(meeting_id: str, audio_path: str):
    """
    Transcribes the audio entirely locally and offline using faster-whisper.
    """
    logger.info(f"Starting local offline transcription for {audio_path}...")
    
    transcript_path = os.path.join(settings.TRANSCRIPTS_DIR, f"transcript_{meeting_id}.txt")
    
    if not os.path.exists(audio_path) or os.path.getsize(audio_path) == 0:
        logger.error("Audio file is missing or empty.")
        return

    try:
        # Import inside the function so it doesn't slow down the main server startup
        from faster_whisper import WhisperModel
        
        # This will download the tiny, fast distil-whisper model the very first time it runs
        logger.info("Loading local Whisper model into memory...")
        
        # We use CPU by default to ensure it runs on any Windows machine
        # The compute_type="int8" compresses it to use less RAM
        model = WhisperModel("distil-large-v3", device="cpu", compute_type="int8")
        
        logger.info("Model loaded! Transcribing audio...")
        
        # Run transcription in a background thread so it doesn't block FastAPI
        def run_stt():
            segments, info = model.transcribe(audio_path, beam_size=5, language="en")
            return list(segments)
            
        segments = await asyncio.to_thread(run_stt)
        
        transcript_text = ""
        for segment in segments:
            line = f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}\n"
            logger.info(line.strip())
            transcript_text += line
            
        with open(transcript_path, "w", encoding="utf-8") as f:
            f.write(transcript_text)
            
        logger.info(f"Transcription complete. Saved to {transcript_path}")
        
        # Trigger RAG indexing here
        from app.rag.pipeline import index_transcript
        await index_transcript(meeting_id, transcript_path)

    except Exception as e:
        logger.error(f"Error during local transcription: {e}")
