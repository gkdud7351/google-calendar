import { useState } from "react";
import './Modal.scss'

type ModalProps = {
  start: Date;
  onClose: () => void;
  onConfirm: (title: string, start:Date, end: Date) => void;
}

const Modal = ({ start, onClose, onConfirm }:ModalProps) => {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState(() => formatTime(start));
  const [endTime, setEndTime] = useState("")

   function formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  function formatKoreanDate(date: Date): string {
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }

  const handleSubmit = () => {
    if (!title || !startTime || !endTime) return;

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startDate = new Date(start);
    const endDate = new Date(start);

    startDate.setHours(sh, sm);
    endDate.setHours(eh, em);

    if (endDate <= startDate) {
      alert('종료시간은 시작시간 이후여야 합니다.');
      return;
    }

    onConfirm(title, startDate, endDate);
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-header">
          <i className="bi bi-x-lg" onClick={onClose}></i>
        </div>
        <input type="text" className="title-input" placeholder="제목 추가" value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <div className="time-row">
          <div className="date-display">{formatKoreanDate(start)}</div>
          <input
            className="start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            className="end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <div className="actions">
          <span>옵션 더보기</span>
          <button type="button" className="confirm-btn" onClick={handleSubmit}>저장</button>
        </div>
      </div>
    </div>
  )
}
export default Modal