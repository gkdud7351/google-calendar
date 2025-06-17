import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./Modal.scss";

type ModalProps = {
  start: Date;
  onClose: () => void;
  onConfirm: (title: string, start: Date, end: Date, allDay: boolean) => void;
};

const Modal = ({ start, onClose, onConfirm }: ModalProps) => {
  const mode = useSelector((state: RootState) => state.calendar.pageMode);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(() =>
    mode === "weekly" ? formatTime(start) : ""
  );
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState(start);
  const [isValid, setIsValid] = useState(false);
  const [endDateIsNextDay, setEndDateIsNextDay] = useState(false);

  // time만 뽑는 함수
  function formatTime(date: Date) {
    return date.toTimeString().slice(0, 5);
  }
  // date만 뽑는 함수
  function formatDate(date: Date) {
    return date.toLocaleDateString("sv-SE");
  }
  // 월,일,요일
  function formatKoreanDate(date: Date) {
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }

  useEffect(() => {
    // 날짜 계산은 항상 수행
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      const isNextDay = eh < sh || (eh === sh && em <= sm);
      setEndDateIsNextDay(isNextDay);
    } else {
      setEndDateIsNextDay(false);
    }

    // 유효성 검사는 title 포함
    if (mode === "weekly") {
      const isFilled = !!(title.trim() && startTime && endTime);
      setIsValid(isFilled);
    } else if (mode === "monthly") {
      const isFilled = !!(title.trim() && endDate);
      setIsValid(isFilled);
    }
  }, [mode, title, startTime, endTime, endDate]);

  const handleSubmit = () => {
    const startDate = new Date(start);
    let computedEnd: Date;

    if (mode === "weekly") {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      startDate.setHours(sh, sm);
      computedEnd = new Date(start);
      computedEnd.setHours(eh, em);
      if (eh < sh || (eh === sh && em <= sm)) {
        computedEnd.setDate(computedEnd.getDate() + 1);
      }
    } else {
      computedEnd = new Date(endDate);
      computedEnd.setDate(computedEnd.getDate() + 1);
    }

    onConfirm(title, startDate, computedEnd, mode === "monthly");
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
              className="end-date"
              type="date"
              value={formatDate(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
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
