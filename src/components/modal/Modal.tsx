import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./Modal.scss";

type ModalProps = {
  start: Date;
  onClose: () => void;
  onConfirm: (title: string, start: Date, end: Date) => void;
};

const Modal = ({ start, onClose, onConfirm }: ModalProps) => {
  const mode = useSelector((state: RootState) => state.calendar.pageMode);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(() => formatTime(start));
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState<Date>(new Date(start));
  const [isValid, setIsValid] = useState(false);
  const [endDateIsNextDay, setEndDateIsNextDay] = useState(false);

  function formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  function formatKoreanDate(date: Date): string {
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }
  function formatDateInput(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  useEffect(() => {
    // 1. 날짜 계산은 항상 수행
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      const isNextDay = eh < sh || (eh === sh && em <= sm);
      setEndDateIsNextDay(isNextDay);
    } else {
      setEndDateIsNextDay(false);
    }

    // 2. 유효성 검사는 title 포함
    const isFilled = !!(title.trim() && startTime && endTime);
    setIsValid(isFilled);
  }, [title, startTime, endTime]);

  const handleSubmit = () => {
    if (!title || !startTime || !endTime) return;

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startDate = new Date(start);
    startDate.setHours(sh, sm);

    let computedEnd: Date;

    if (mode === "weekly") {
      computedEnd = new Date(start);
      computedEnd.setHours(eh, em);
      if (eh < sh || (eh === sh && em <= sm)) {
        computedEnd.setDate(computedEnd.getDate() + 1);
      }
    } else {
      computedEnd = new Date(endDate);
      computedEnd.setHours(eh, em);
    }

    onConfirm(title, startDate, computedEnd);
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-header">
          <i className="bi bi-x-lg" onClick={onClose}></i>
        </div>
        <input
          type="text"
          className="title-input"
          placeholder="제목 추가"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {mode === "weekly" ? (
          <div className="time-row">
            <div className="date-display">{formatKoreanDate(start)}</div>
            <input
              className="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              className="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            {endDateIsNextDay && (
              <div className="date-display">
                {formatKoreanDate(new Date(start.getTime() + 86400000))}
              </div>
            )}
          </div>
        ) : (
          <div className="time-row">
            <div className="date-display">{formatKoreanDate(start)}</div>
            <input
              className="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              className="end-date"
              type="date"
              value={formatDateInput(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />

            <input
              className="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        )}
        <div className="actions">
          <span>옵션 더보기</span>
          <button
            type="button"
            className="confirm-btn"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
