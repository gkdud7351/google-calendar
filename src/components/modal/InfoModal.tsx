import { useEffect, useRef } from "react";
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

type InfoModalProps = {
  event: EventType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
};

const InfoModal = ({
  event,
  onClose,
  onEdit,
  onDelete,
  style,
}: InfoModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const mode = useSelector((state: RootState) => state.calendar.pageMode);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const formatDateTime = (date: Date) => {
    const dateStr = date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });

    const timeStr = date.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // 오전/오후 표시
    });

    return `${dateStr} ${timeStr}`;
  };

  // date만 뽑는 함수
  function formatDate(date: Date) {
    return date.toLocaleDateString("sv-SE");
  }
  function adjustedEndIfAllDay(end: Date, allDay?: boolean): Date {
    if (!allDay) {
      return end;
    } else {
      const adjusted = new Date(end);
      adjusted.setDate(adjusted.getDate() - 1);
      return adjusted;
    }
  }
  return (
    <div className="infoModal-container" ref={modalRef}>
      <div className="infoModal" style={style}>
        <div className="infoModal-header">
          <i className="bi bi-pencil" onClick={onEdit}></i>
          <i className="bi bi-trash3" onClick={() => onDelete(event.id)}></i>
          <i className="bi bi-x-lg" onClick={onClose}></i>
        </div>
        {mode === "weekly" ? (
          <div className="info">
            <h2 className="info-title">{event.title}</h2>
            <p>
              {formatDateTime(event.start)} ~ {formatDateTime(event.end)}
            </p>
          </div>
        ) : (
          <div className="info">
            <h2 className="info-title">{event.title}</h2>
            <p>
              {formatDate(event.start)}{" "}
              {event.end
                ? `~ ${formatDate(
                    adjustedEndIfAllDay(event.end, event.allDay)
                  )}`
                : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal;
