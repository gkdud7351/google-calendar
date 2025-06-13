import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useRef, useEffect, useState } from "react";
import { addEvent, deleteEvent } from "../features/calendar/calendarSlice";
import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import Modal from "../components/modal/Modal";
import InfoModal from "../components/modal/InfoModal";
import "./WeekCalendar.scss";

const WeekCalendar = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef<FullCalendar | null>(null);
  const selectedDate = useSelector(
    (state: RootState) => state.calendar.selectedDate
  );
  const events = useSelector((state: RootState) => state.calendar.events);
  const [modalOpen, setModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
    start: Date;
    end: Date;
  } | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedStart(arg.date);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const rect = clickInfo.el.getBoundingClientRect();

    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start!,
      end: clickInfo.event.end!,
    });

    setModalPosition({
      x: rect.right + window.scrollX,
      y: rect.top + window.scrollY,
    });

    setInfoModal(true);
  };

  const handleConfirm = (title: string, start: Date, end: Date) => {
    dispatch(
      addEvent({
        id: String(Date.now()),
        title,
        start,
        end,
        allDay: false,
      })
    );

    setModalOpen(false);
    setSelectedStart(null);
  };

  // selectedDate가 바뀌면 캘린더 이동
  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.gotoDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <>
      <FullCalendar
        locale={koLocale}
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        initialView="timeGridWeek"
        height="auto"
        initialDate={selectedDate}
        headerToolbar={false}
      />

      {modalOpen && selectedStart && (
        <Modal
          start={selectedStart}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

      {infoModal && selectedEvent && modalPosition && (
        <InfoModal
          event={selectedEvent}
          onClose={() => setInfoModal(false)}
          onEdit={(event) => {
            // 필요시 수정용 Modal 띄우거나 편집 처리
          }}
          onDelete={(id) => {
            dispatch(deleteEvent(id));
            setInfoModal(false);
          }}
          style={{
            position: "absolute",
            top: modalPosition.y,
            left: modalPosition.x,
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
};

export default WeekCalendar;
