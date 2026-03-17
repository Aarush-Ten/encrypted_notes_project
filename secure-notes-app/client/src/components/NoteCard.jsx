import api from '../utils/api';
import './NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownloadFile = async () => {
    try {
      const response = await api.get(`/notes/${note._id}/file`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', note.file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download file');
      console.error(err);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
      {note.isPinned && (
        <div className="pin-badge">📌 Pinned</div>
      )}

      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {note.completed && <span className="badge badge-success">✅ Completed</span>}
          {note.dueDate && <span className="badge badge-info">Due {new Date(note.dueDate).toLocaleDateString()}</span>}
        </div>
        <div className="note-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(note)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(note._id)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="note-content">{truncateText(note.description, 200)}</p>

      {note.file && (
        <div className="note-file">
          <div className="file-info">
            <span className="file-icon">📎</span>
            <span className="file-name">{note.file.originalName}</span>
          </div>
          <button className="btn-download" onClick={handleDownloadFile}>
            ⬇️ Download
          </button>
        </div>
      )}

      <div className="note-footer">
        <span className="note-date">
          {formatDate(note.updatedAt || note.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
