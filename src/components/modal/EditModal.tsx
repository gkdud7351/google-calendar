import { useEffect, useState } from "react";
import "./Modal.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
type EventType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

type EditModalProps = {
  event: EventType;
  onClose: () => void;
  onConfirm: (event: EventType) => void;
  style?: React.CSSProperties;
};

const EditModal = ({ event, onClose, onConfirm, style }: EditModalProps) => {
  const mode = useSelector((state: RootState) => state.calendar.pageMode);
  const [isValid, setIsValid] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [startDate, setStartDate] = useState(() => formatDate(event.start));
  const [startTime, setStartTime] = useState(() => formatTime(event.start));
  const [endDate, setEndDate] = useState(() => formatDate(event.end));
  const [endTime, setEndTime] = useState(() => formatTime(event.end));
  const [endDateIsNextDay, setEndDateIsNextDay] = useState(false);

  // time만 뽑는 함수
  function formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }
  // date만 뽑는 함수
  function formatDate(date: Date): string {
    return date.toLocaleDateString("sv-SE"); //toISOString()에서 발생하던 KST 밀림 문제 해결
  }
  // 월,일,요일
  function formatKoreanDate(date: Date): string {
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "long",
    });
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

    const start = new Date(startDate);
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    start.setHours(sh, sm);
    let end: Date;
    if (mode === "weekly") {
      end = new Date(startDate);
      end.setHours(eh, em);
      if (eh < sh || (eh === sh && em <= sm)) {
        end.setDate(end.getDate() + 1);
      }
    } else {
      end = new Date(startDate);
      end.setHours(eh, em);
    }
    onConfirm({
      id: event.id,
      title,
      start,
      end,
    });
  };
  return (
    <div className="editModal-container">
      <div className="editModal" style={style}>
        <div className="editModal-header">
          <i className="bi bi-x-lg" onClick={onClose}></i>
        </div>
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {mode === "weekly" ? (
          <div className="time-row">
            <input
              className="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              className="start-time"
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
                {formatKoreanDate(
                  new Date(new Date(startDate).getTime() + 86400000)
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="time-row">
            <input
              className="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              className="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              className="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              className="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            {endDateIsNextDay && (
              <div className="date-display">
                {formatKoreanDate(
                  new Date(new Date(startDate).getTime() + 86400000)
                )}
              </div>
            )}
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
export default EditModal;
