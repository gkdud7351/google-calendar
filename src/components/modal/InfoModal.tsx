import { useEffect, useRef } from "react";
import "./Modal.scss";
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
  onEdit: (event: EventType) => void;
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

  return (
    <div className="infoModal-container" ref={modalRef}>
      <div className="info-modal" style={style}>
        <div className="infoModal-header">
          <i className="bi bi-pencil" onClick={() => onEdit(event)}></i>
          <i className="bi bi-trash3" onClick={() => onDelete(event.id)}></i>
          <i className="bi bi-x-lg" onClick={onClose}></i>
        </div>
        <div className="info">
          <h2 className="info-title">{event.title}</h2>
          <p>
            {formatDateTime(event.start)} ~ {formatDateTime(event.end)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
